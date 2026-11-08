import { createHash, randomBytes } from 'crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

type Doc = Record<string, any>;
export type Filter<T = Doc> = Record<string, any> & Partial<Record<keyof T, any>>;
type Projection = Record<string, 0 | 1 | boolean>;
type SortSpec = Record<string, 1 | -1>;

export class ObjectId {
  private readonly value: string;

  constructor(value?: string | ObjectId) {
    const raw = value === undefined ? randomBytes(12).toString('hex') : String(value);
    if (!/^[\da-f]{24}$/i.test(raw)) throw new TypeError(`Invalid document id: ${raw}`);
    this.value = raw.toLowerCase();
  }

  toString() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }

  static isValid(value: unknown): boolean {
    return value instanceof ObjectId || (typeof value === 'string' && /^[\da-f]{24}$/i.test(value));
  }
}

function comparable(value: unknown): unknown {
  if (value instanceof ObjectId) return value.toString();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(value)) {
    return Date.parse(value);
  }
  return value;
}

function equal(left: unknown, right: unknown): boolean {
  const a = comparable(left);
  const b = comparable(right);
  if ((a === null || a === undefined) && (b === null || b === undefined)) return true;
  if (Array.isArray(a)) return a.some((item) => equal(item, b));
  if (a instanceof RegExp) return typeof b === 'string' && a.test(b);
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return a === b;
}

function getPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || typeof value !== 'object') return undefined;
    return (value as Record<string, unknown>)[key];
  }, source);
}

function setPath(target: Doc, path: string, value: unknown) {
  const keys = path.split('.');
  let node = target;
  for (const key of keys.slice(0, -1)) {
    if (!node[key] || typeof node[key] !== 'object' || Array.isArray(node[key])) node[key] = {};
    node = node[key];
  }
  node[keys[keys.length - 1]] = value;
}

function unsetPath(target: Doc, path: string) {
  const keys = path.split('.');
  let node = target;
  for (const key of keys.slice(0, -1)) {
    if (!node[key] || typeof node[key] !== 'object') return;
    node = node[key];
  }
  delete node[keys[keys.length - 1]];
}

function matchesValue(value: unknown, condition: unknown): boolean {
  if (condition instanceof RegExp) return typeof value === 'string' && condition.test(value);
  if (!condition || typeof condition !== 'object' || condition instanceof Date || condition instanceof ObjectId || Array.isArray(condition)) {
    return equal(value, condition);
  }
  const operators = condition as Record<string, unknown>;
  if (!Object.keys(operators).some((key) => key.startsWith('$'))) return equal(value, condition);
  return Object.entries(operators).every(([operator, expected]) => {
    const actual = comparable(value);
    const target = comparable(expected);
    switch (operator) {
      case '$eq': return equal(value, expected);
      case '$ne': return !equal(value, expected);
      case '$in': return Array.isArray(expected) && expected.some((item) => matchesValue(value, item));
      case '$nin': return Array.isArray(expected) && !expected.some((item) => matchesValue(value, item));
      case '$exists': return (value !== undefined) === Boolean(expected);
      case '$regex': {
        const expression = expected instanceof RegExp ? expected : new RegExp(String(expected), String(operators.$options || ''));
        return typeof value === 'string' && expression.test(value);
      }
      case '$options': return true;
      case '$gt': return (actual as any) > (target as any);
      case '$gte': return (actual as any) >= (target as any);
      case '$lt': return (actual as any) < (target as any);
      case '$lte': return (actual as any) <= (target as any);
      case '$type':
        return expected === 'string' ? typeof value === 'string'
          : expected === 'number' ? typeof value === 'number'
            : expected === 'date' ? value instanceof Date || (typeof value === 'string' && !Number.isNaN(Date.parse(value)))
              : expected === 'object' ? typeof value === 'object' && value !== null && !Array.isArray(value)
                : expected === 'array' ? Array.isArray(value)
                  : expected === 'bool' ? typeof value === 'boolean'
                  : false;
      case '$elemMatch': return Array.isArray(value) && value.some((item) => matches(item, expected as Filter));
      case '$size': return Array.isArray(value) && value.length === expected;
      case '$not': return !matchesValue(value, expected);
      default: throw new Error(`Unsupported PostgreSQL document filter operator: ${operator}`);
    }
  });
}

function matches(document: Doc, filter: Filter): boolean {
  return Object.entries(filter || {}).every(([path, condition]) => {
    if (path === '$or') return Array.isArray(condition) && condition.some((item) => matches(document, item));
    if (path === '$and') return Array.isArray(condition) && condition.every((item) => matches(document, item));
    if (path === '$nor') return Array.isArray(condition) && !condition.some((item) => matches(document, item));
    return matchesValue(getPath(document, path), condition);
  });
}

function compileFilterSql(filter: Filter, values: unknown[]): string {
  const isScalar = (value: unknown) =>
    value === null || value instanceof ObjectId || typeof value !== 'object';
  const bind = (value: unknown) => {
    const normalized = value instanceof ObjectId ? value.toString() : value instanceof Date ? value.toISOString() : value;
    const serialized = JSON.stringify(normalized);
    if (serialized === undefined) throw new Error('Invalid undefined PostgreSQL document filter value');
    values.push(serialized);
    return `$${values.length}::jsonb`;
  };
  const expression = (path: string) => {
    if (!/^[a-zA-Z0-9_.-]+$/.test(path)) throw new Error('Invalid PostgreSQL document filter field');
    const jsonPath = path.split('.').map((part) => `"${part.replace(/"/g, '""')}"`).join(',');
    return `(payload #> '{${jsonPath}}')`;
  };
  const equality = (field: string, value: unknown): string => {
    const column = expression(field);
    if (value === null || value === undefined) return `(${column} IS NULL OR ${column} = 'null'::jsonb OR (jsonb_typeof(${column}) = 'array' AND ${column} @> '[null]'::jsonb))`;
    if (!isScalar(value)) return 'TRUE';
    const parameter = bind(value);
    const contains = !Array.isArray(value)
      ? ` OR (jsonb_typeof(${column}) = 'array' AND ${column} @> jsonb_build_array(${parameter}))`
      : '';
    return `((${column} = ${parameter})${contains})`;
  };
  const fieldPredicate = (field: string, condition: unknown): string => {
    const column = expression(field);
    if (condition instanceof RegExp) {
      return 'TRUE';
    }
    if (!condition || typeof condition !== 'object' || condition instanceof Date || condition instanceof ObjectId || Array.isArray(condition)) {
      return condition === null || condition === undefined
        ? `(${column} IS NULL OR ${column} = 'null'::jsonb)`
        : equality(field, condition);
    }
    const operators = condition as Doc;
    if (!Object.keys(operators).some((key) => key.startsWith('$'))) return equality(field, condition);
    return Object.entries(operators).map(([operator, value]) => {
      switch (operator) {
        case '$eq': return equality(field, value);
        case '$ne':
          return !isScalar(value)
            ? 'TRUE'
            : `((${column} IS NULL) OR NOT ${equality(field, value)})`;
        case '$in':
          if (!Array.isArray(value)) throw new Error('$in requires an array');
          return value.length ? `(${value.some((item) => !isScalar(item)) ? 'TRUE' : value.map((item) => equality(field, item)).join(' OR ')})` : 'FALSE';
        case '$nin':
          if (!Array.isArray(value)) throw new Error('$nin requires an array');
          return value.length
            ? value.some((item) => !isScalar(item))
              ? 'TRUE'
              : `((${column} IS NULL) OR NOT (${value.map((item) => equality(field, item)).join(' OR ')}))`
            : 'TRUE';
        case '$exists': return value ? `${column} IS NOT NULL` : `${column} IS NULL`;
        case '$regex': return 'TRUE';
        case '$options': return 'TRUE';
        case '$gt':
        case '$gte':
        case '$lt':
        case '$lte': return 'TRUE';
        case '$type': {
          const type = value === 'string' ? 'string'
            : value === 'number' ? 'number'
              : value === 'date' ? 'string'
                : value === 'object' ? 'object'
                  : value === 'array' ? 'array'
                    : value === 'bool' ? 'boolean'
                      : null;
          if (!type) throw new Error(`Unsupported PostgreSQL document type query: ${String(value)}`);
          return `jsonb_typeof(${column}) = '${type}'`;
        }
        case '$elemMatch':
        case '$not': return 'TRUE';
        case '$size':
          return Number.isInteger(value) && Number(value) >= 0
            ? `(CASE WHEN jsonb_typeof(${column}) = 'array' THEN jsonb_array_length(${column}) = ${Number(value)} ELSE FALSE END)`
            : 'TRUE';
        default: throw new Error(`Unsupported PostgreSQL document filter operator: ${operator}`);
      }
    }).map((part) => `(${part})`).join(' AND ');
  };

  return Object.entries(filter || {}).map(([field, condition]) => {
    if (field === '$or' || field === '$and' || field === '$nor') {
      if (!Array.isArray(condition)) throw new Error(`Invalid ${field} PostgreSQL document filter`);
      if (!condition.length) return field === '$and' ? 'TRUE' : 'FALSE';
      const parts = condition.map((part) => `(${compileFilterSql(part, values)})`);
      const joined = parts.join(field === '$and' ? ' AND ' : ' OR ');
      return field === '$nor' ? `(NOT (${joined}))` : `(${joined})`;
    }
    return fieldPredicate(field, condition);
  }).map((part) => `(${part})`).join(' AND ') || 'TRUE';
}

function project(document: Doc, projection?: Projection): Doc {
  if (!projection || Object.keys(projection).length === 0) return { ...document };
  const included = Object.entries(projection).filter(([key, enabled]) => key !== '_id' && Boolean(enabled));
  if (included.length) {
    const out: Doc = {};
    for (const [path] of included) {
      const value = getPath(document, path);
      if (value !== undefined) setPath(out, path, value);
    }
    if (projection._id !== 0 && document._id !== undefined) out._id = document._id;
    return out;
  }
  const out = { ...document };
  for (const [path, enabled] of Object.entries(projection)) if (!enabled) unsetPath(out, path);
  return out;
}

function clean(value: Doc): Prisma.InputJsonValue {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) throw new Error('Cannot store an undefined PostgreSQL document');
  return JSON.parse(serialized);
}

function pathValues(document: Doc, expression: unknown): unknown {
  if (typeof expression === 'string' && expression.startsWith('$')) return getPath(document, expression.slice(1));
  if (Array.isArray(expression)) return expression.map((item) => pathValues(document, item));
  if (expression && typeof expression === 'object') {
    const entries = Object.entries(expression as Doc);
    if (entries.length === 1) {
      const [operator, value] = entries[0];
      const args = pathValues(document, value);
      if (operator === '$toLower') return String(args ?? '').toLowerCase();
      if (operator === '$trim') {
        const trim = args as Doc;
        return String(trim?.input ?? '').trim();
      }
      if (operator === '$ifNull') return Array.isArray(args) ? args.find((item) => item !== null && item !== undefined) ?? null : args;
      if (operator === '$subtract' && Array.isArray(args)) return Number(args[0] || 0) - Number(args[1] || 0);
      if (operator.startsWith('$')) throw new Error(`Unsupported PostgreSQL document expression: ${operator}`);
    }
    return Object.fromEntries(entries.map(([key, item]) => [key, pathValues(document, item)]));
  }
  return expression;
}

function updateDocument(document: Doc, update: Doc | Doc[], inserting = false): Doc {
  let next = { ...document };
  if (Array.isArray(update)) {
    for (const stage of update) {
      const set = stage.$set || stage.$addFields;
      if (set) {
        const evaluated = Object.fromEntries(Object.entries(set).map(([key, value]) => [key, pathValues(next, value)]));
        next = updateDocument(next, { $set: evaluated });
      } else throw new Error('Unsupported PostgreSQL document update pipeline stage');
    }
    return next;
  }
  const isOperatorUpdate = Object.keys(update).some((key) => key.startsWith('$'));
  if (!isOperatorUpdate) return { ...next, ...update, _id: next._id };
  const supported = new Set(['$set', '$setOnInsert', '$unset', '$inc', '$mul', '$min', '$max', '$push', '$addToSet', '$pull']);
  const unsupported = Object.keys(update).find((key) => key.startsWith('$') && !supported.has(key));
  if (unsupported) throw new Error(`Unsupported PostgreSQL document update operator: ${unsupported}`);
  for (const [path, value] of Object.entries(update.$set || {})) setPath(next, path, value);
  if (inserting) for (const [path, value] of Object.entries(update.$setOnInsert || {})) {
    if (getPath(next, path) === undefined) setPath(next, path, value);
  }
  for (const path of Object.keys(update.$unset || {})) unsetPath(next, path);
  for (const [path, amount] of Object.entries(update.$inc || {})) {
    setPath(next, path, Number(getPath(next, path) || 0) + Number(amount));
  }
  for (const [path, amount] of Object.entries(update.$mul || {})) {
    setPath(next, path, Number(getPath(next, path) || 0) * Number(amount));
  }
  for (const [path, value] of Object.entries(update.$min || {})) {
    if (getPath(next, path) === undefined || (comparable(getPath(next, path)) as any) > (comparable(value) as any)) setPath(next, path, value);
  }
  for (const [path, value] of Object.entries(update.$max || {})) {
    if (getPath(next, path) === undefined || (comparable(getPath(next, path)) as any) < (comparable(value) as any)) setPath(next, path, value);
  }
  for (const [path, value] of Object.entries(update.$push || {})) {
    const current = getPath(next, path);
    const incoming = value && typeof value === 'object' && '$each' in value ? (value as Doc).$each : [value];
    setPath(next, path, [...(Array.isArray(current) ? current : []), ...(incoming as unknown[])]);
  }
  for (const [path, value] of Object.entries(update.$addToSet || {})) {
    const current = Array.isArray(getPath(next, path)) ? [...getPath(next, path) as unknown[]] : [];
    const incoming = value && typeof value === 'object' && '$each' in value ? (value as Doc).$each as unknown[] : [value];
    for (const item of incoming) if (!current.some((entry) => equal(entry, item))) current.push(item);
    setPath(next, path, current);
  }
  for (const [path, value] of Object.entries(update.$pull || {})) {
    const current = getPath(next, path);
    if (Array.isArray(current)) setPath(next, path, current.filter((entry) => !matchesValue(entry, value)));
  }
  return next;
}

type Stored = { id: string; payload: Prisma.JsonValue };

class Cursor<T = Doc> {
  private sortSpec: SortSpec = {};
  private projection?: Projection;
  private max?: number;
  private offset = 0;

  constructor(private readonly load: () => Promise<Doc[]>) {}

  sort(spec: SortSpec) { this.sortSpec = spec; return this; }
  limit(count: number) { this.max = count; return this; }
  skip(count: number) { this.offset = count; return this; }
  project(spec: Projection) { this.projection = spec; return this; }

  async next(): Promise<T | null> {
    const rows = await this.limit(1).toArray();
    return rows[0] ?? null;
  }

  async toArray(): Promise<T[]> {
    let rows = await this.load();
    for (const [field, direction] of Object.entries(this.sortSpec)) {
      rows = rows.sort((a, b) => {
        const left = comparable(getPath(a, field));
        const right = comparable(getPath(b, field));
        if (left === right) return 0;
        return (left as any) < (right as any) ? -direction : direction;
      });
    }
    rows = rows.slice(this.offset, this.max === undefined ? undefined : this.offset + this.max);
    return rows.map((row) => project(row, this.projection)) as T[];
  }
}

function evaluateAggregateExpression(document: Doc, expression: unknown): unknown {
  return pathValues(document, expression);
}

function aggregate(rows: Doc[], pipeline: Doc[]): Doc[] {
  let result = rows;
  for (const stage of pipeline) {
    if (stage.$match) result = result.filter((row) => matches(row, stage.$match));
    else if (stage.$sort) {
      const sort = stage.$sort as SortSpec;
      result = [...result].sort((a, b) => {
        for (const [path, direction] of Object.entries(sort)) {
          const left = comparable(getPath(a, path));
          const right = comparable(getPath(b, path));
          if (left !== right) return (left as any) < (right as any) ? -direction : direction;
        }
        return 0;
      });
    } else if (stage.$limit !== undefined) result = result.slice(0, Number(stage.$limit));
    else if (stage.$skip !== undefined) result = result.slice(Number(stage.$skip));
    else if (stage.$project) {
      result = result.map((row) => {
        const output: Doc = {};
        for (const [path, value] of Object.entries(stage.$project)) {
          if (value === 1) {
            const found = getPath(row, path);
            if (found !== undefined) setPath(output, path, found);
          } else if (value !== 0) setPath(output, path, evaluateAggregateExpression(row, value));
        }
        if (stage.$project._id !== 0 && row._id !== undefined) output._id = row._id;
        return output;
      });
    } else if (stage.$group) {
      const spec = stage.$group as Doc;
      const groups = new Map<string, { key: unknown; rows: Doc[] }>();
      for (const row of result) {
        const key = evaluateAggregateExpression(row, spec._id);
        const serialized = JSON.stringify(key) ?? 'null';
        const group = groups.get(serialized) || { key, rows: [] };
        group.rows.push(row);
        groups.set(serialized, group);
      }
      result = Array.from(groups.values()).map(({ key, rows: members }) => {
        const output: Doc = { _id: key };
        for (const [field, expression] of Object.entries(spec)) {
          if (field === '_id') continue;
          const [operator, value] = Object.entries(expression as Doc)[0] || [];
          const evaluated = members.map((row) => evaluateAggregateExpression(row, value));
          if (operator === '$sum') output[field] = value === 1
            ? members.length
            : evaluated.reduce<number>((sum, item) => sum + Number(item || 0), 0);
          else if (operator === '$addToSet') output[field] = Array.from(new Map(evaluated.map((item) => [JSON.stringify(item), item])).values());
          else if (operator === '$push') output[field] = evaluated;
          else if (operator === '$first') output[field] = evaluated[0];
          else if (operator === '$last') output[field] = evaluated[evaluated.length - 1];
          else throw new Error(`Unsupported PostgreSQL document group operator: ${operator}`);
        }
        return output;
      });
    } else throw new Error(`Unsupported PostgreSQL document aggregation stage: ${Object.keys(stage)[0]}`);
  }
  return result;
}

function compilePartialFilter(filter: Filter): string {
  return Object.entries(filter).map(([field, condition]) => {
    if (field === '$or' || field === '$and') {
      if (!Array.isArray(condition)) throw new Error('Invalid PostgreSQL document partial index filter');
      const operator = field === '$or' ? ' OR ' : ' AND ';
      return `(${condition.map((part) => compilePartialFilter(part)).join(operator)})`;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(field)) throw new Error('Invalid PostgreSQL document partial index field');
    const path = field.split('.').map((part) => `"${part.replace(/"/g, '""')}"`).join(',');
    const expression = `(payload #> '{${path}}')`;
    if (condition && typeof condition === 'object' && '$type' in condition) {
      const type = condition.$type === 'string' ? 'string'
        : condition.$type === 'number' ? 'number'
          : condition.$type === 'object' ? 'object'
            : condition.$type === 'array' ? 'array'
              : condition.$type === 'bool' ? 'boolean'
                : null;
      if (!type) throw new Error(`Unsupported PostgreSQL document partial index type: ${String(condition.$type)}`);
      return `jsonb_typeof(${expression}) = '${type}'`;
    }
    const serialized = JSON.stringify(condition);
    if (serialized === undefined) throw new Error('Invalid PostgreSQL document partial index value');
    return `${expression} = '${serialized.replace(/'/g, "''")}'::jsonb`;
  }).join(' AND ');
}

class DocumentCollection {
  private static indexes = new Map<string, Array<{ name: string; key: Record<string, number>; unique: boolean; sparse: boolean }>>();
  /**
   * Indexes already ensured by this process. Callers run createIndex on hot request paths;
   * without this, every request issued CREATE INDEX, which takes a SHARE lock on app_documents
   * and queued up until the connection pool was exhausted.
   */
  private static ensuredIndexes = new Map<string, Promise<void>>();

  constructor(private readonly name: string) {}

  private async rows(filter: Filter = {}): Promise<Doc[]> {
    const values: unknown[] = [this.name];
    const where = compileFilterSql(filter, values);
    const records = await prisma.$queryRawUnsafe<Stored[]>(
      `SELECT id, payload FROM app_documents WHERE collection = $1 AND ${where}`,
      ...values,
    );
    return records.map(({ id, payload }) => {
      const document = payload as Doc;
      return { ...document, _id: document._id ?? (ObjectId.isValid(id) ? new ObjectId(id) : id) };
    });
  }

  find(filter: Filter = {}, options?: { projection?: Projection }) {
    const cursor = new Cursor(() => this.rows(filter).then((rows) => rows.filter((row) => matches(row, filter))));
    if (options?.projection) cursor.project(options.projection);
    return cursor;
  }

  async findOne(filter: Filter = {}, options?: { projection?: Projection; sort?: SortSpec }): Promise<Doc | null> {
    const cursor = this.find(filter, options);
    if (options?.sort) cursor.sort(options.sort);
    return (await cursor.limit(1).toArray())[0] ?? null;
  }

  async insertOne(input: Doc) {
    const document = { ...input, _id: input._id ?? new ObjectId() };
    const id = String(document._id);
    await prisma.appDocument.create({
      data: { collection: this.name, id, payload: clean(document) },
    });
    return { acknowledged: true, insertedId: document._id };
  }

  async insertMany(inputs: Doc[]) {
    const insertedIds: Record<number, unknown> = {};
    for (const [index, document] of inputs.entries()) {
      const result = await this.insertOne(document);
      insertedIds[index] = result.insertedId;
    }
    return { acknowledged: true, insertedCount: inputs.length, insertedIds };
  }

  async updateOne(
    filter: Filter,
    update: Doc | Doc[],
    options: { upsert?: boolean } = {},
  ): Promise<{ acknowledged: boolean; matchedCount: number; modifiedCount: number; upsertedId: unknown; upsertedCount: number }> {
    const current = await this.findOne(filter);
    if (!current) {
      if (!options.upsert) return { acknowledged: true, matchedCount: 0, modifiedCount: 0, upsertedId: null, upsertedCount: 0 };
      const seed: Doc = {};
      for (const [path, value] of Object.entries(filter)) {
        if (!path.startsWith('$') && (!value || typeof value !== 'object' || value instanceof Date || value instanceof ObjectId || Array.isArray(value))) {
          setPath(seed, path, value);
        }
      }
      const created = updateDocument({ ...seed, _id: seed._id ?? new ObjectId() }, update, true);
      const inserted = await this.insertOne(created);
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0, upsertedId: inserted.insertedId, upsertedCount: 1 };
    }
    const updated = updateDocument(current, update);
    await prisma.appDocument.update({
      where: { collection_id: { collection: this.name, id: String(current._id) } },
      data: { payload: clean(updated) },
    });
    return { acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedId: null, upsertedCount: 0 };
  }

  async updateMany(filter: Filter, update: Doc | Doc[]) {
    const records = await this.find(filter).toArray();
    for (const current of records) {
      const updated = updateDocument(current, update);
      await prisma.appDocument.update({
        where: { collection_id: { collection: this.name, id: String(current._id) } },
        data: { payload: clean(updated) },
      });
    }
    return { acknowledged: true, matchedCount: records.length, modifiedCount: records.length, upsertedCount: 0 };
  }

  async deleteOne(filter: Filter) {
    const current = await this.findOne(filter);
    if (!current) return { acknowledged: true, deletedCount: 0 };
    await prisma.appDocument.delete({
      where: { collection_id: { collection: this.name, id: String(current._id) } },
    });
    return { acknowledged: true, deletedCount: 1 };
  }

  async deleteMany(filter: Filter = {}) {
    const records = await this.find(filter).toArray();
    if (records.length) {
      await prisma.appDocument.deleteMany({
        where: { collection: this.name, id: { in: records.map((row) => String(row._id)) } },
      });
    }
    return { acknowledged: true, deletedCount: records.length };
  }

  async countDocuments(filter: Filter = {}) {
    return (await this.find(filter).toArray()).length;
  }

  async distinct(field: string, filter: Filter = {}) {
    const rows = await this.find(filter).toArray();
    return Array.from(new Map(rows.map((row) => getPath(row, field)).filter((value) => value !== undefined).map((value) => [JSON.stringify(value), value])).values());
  }

  aggregate<T = Doc>(pipeline: Doc[]) {
    return new Cursor<T>(() => this.rows().then((rows) => aggregate(rows, pipeline)));
  }

  async createIndex(
    keys: Record<string, 1 | -1>,
    options: {
      unique?: boolean;
      sparse?: boolean;
      name?: string;
      partialFilterExpression?: Filter;
    } = {},
  ) {
    const keysList = Object.keys(keys);
    if (!keysList.length || keysList.some((key) => !/^[a-zA-Z0-9_.-]+$/.test(key))) {
      throw new Error(`Invalid PostgreSQL document index in collection ${this.name}`);
    }
    const fingerprint = createHash('sha256').update(`${this.name}:${keysList.join(',')}`).digest('hex').slice(0, 20);
    const requestedName = options.name && /^[a-zA-Z0-9_]+$/.test(options.name)
      ? `${this.name}_${options.name}`
      : `app_docs_${fingerprint}`;
    const indexName = `app_docs_${requestedName}`.slice(0, 60);
    const collectionName = this.name.replace(/'/g, "''");
    const expressions = keysList.map((key) => {
      const jsonPath = key.split('.').map((part) => `"${part.replace(/"/g, '""')}"`).join(',');
      return `(payload #> '{${jsonPath}}')`;
    });
    const uniqueness = options.unique ? 'UNIQUE ' : '';
    const filters = [`collection = '${collectionName}'`];
    if (options.unique) filters.push(...expressions.map((expr) => `${expr} IS NOT NULL AND ${expr} <> 'null'::jsonb`));
    if (options.partialFilterExpression) filters.push(compilePartialFilter(options.partialFilterExpression));
    const where = options.unique || options.partialFilterExpression ? ` WHERE ${filters.join(' AND ')}` : '';
    let ensured = DocumentCollection.ensuredIndexes.get(indexName);
    if (!ensured) {
      ensured = (async () => {
        // Catalogue lookup takes no table lock; only build the index when it is really missing.
        const existing = await prisma.$queryRawUnsafe<unknown[]>(
          `SELECT 1 FROM pg_class WHERE relkind = 'i' AND relname = $1 LIMIT 1`,
          indexName,
        );
        if (!existing.length) {
          await prisma.$executeRawUnsafe(
            `CREATE ${uniqueness}INDEX IF NOT EXISTS "${indexName}" ON app_documents (collection, ${expressions.join(', ')})${where}`,
          );
        }
        const metadata = DocumentCollection.indexes.get(this.name) || [];
        metadata.push({ name: indexName, key: keys, unique: Boolean(options.unique), sparse: Boolean(options.sparse) });
        DocumentCollection.indexes.set(this.name, metadata);
      })();
      DocumentCollection.ensuredIndexes.set(indexName, ensured);
      // A failed attempt (e.g. a transient timeout) may be retried by the next caller.
      ensured.catch(() => DocumentCollection.ensuredIndexes.delete(indexName));
    }
    await ensured;
    return indexName;
  }

  async indexes(): Promise<Array<{ name: string; key: Record<string, number>; unique?: boolean; sparse?: boolean }>> {
    return [{ name: '_id_', key: { _id: 1 }, unique: true }, ...(DocumentCollection.indexes.get(this.name) || [])];
  }

  async dropIndex(name: string) {
    if (!/^[a-zA-Z0-9_]+$/.test(name)) throw new Error('Invalid index name');
    const indexName = name.startsWith('app_docs_') ? name : `app_docs_${name}`;
    await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS "${indexName}"`);
    DocumentCollection.ensuredIndexes.delete(indexName);
    DocumentCollection.indexes.set(this.name, (DocumentCollection.indexes.get(this.name) || []).filter((index) => index.name !== indexName));
    return { acknowledged: true };
  }
}

const collectionCache = new Map<string, DocumentCollection>();

export function getDocumentDatabase() {
  return {
    collection(name: string) {
      if (!/^[a-zA-Z0-9_-]+$/.test(name)) throw new Error('Invalid PostgreSQL document collection name');
      let collection = collectionCache.get(name);
      if (!collection) {
        collection = new DocumentCollection(name);
        collectionCache.set(name, collection);
      }
      return collection;
    },
    listCollections(_filter?: Filter, _options?: { nameOnly?: boolean }) {
      return new Cursor(async () => {
        const names = await prisma.appDocument.findMany({
          distinct: ['collection'],
          select: { collection: true },
        });
        return names.map(({ collection }) => ({ name: collection }));
      });
    },
    async createCollection(name: string) {
      if (!/^[a-zA-Z0-9_-]+$/.test(name)) throw new Error('Invalid PostgreSQL document collection name');
      return { collectionName: name };
    },
  };
}
