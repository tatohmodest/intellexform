export const DATA_FIELD_TYPES = [
  'short_text',
  'long_text',
  'number',
  'email',
  'phone',
  'date',
  'time',
  'datetime',
  'dropdown',
  'multi_select',
  'radio',
  'checkbox',
  'yes_no',
  'file',
  'image',
  'url',
  'student',
  'staff',
  'campus',
  'department',
  'faculty',
  'program',
  'course',
  'cohort',
  'class',
  'address',
  'country',
  'signature',
] as const;

export type DataFieldType = (typeof DATA_FIELD_TYPES)[number];

export type DataField = {
  id: string;
  key: string;
  label: string;
  description: string;
  placeholder: string;
  type: DataFieldType;
  required: boolean;
  options: string[];
  min?: number | null;
  max?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
  defaultValue?: string;
  autoFrom?: 'name' | 'email' | 'matricule' | 'program' | 'department' | 'campus' | null;
  showIf?: { fieldId: string; op: 'eq' | 'neq'; value: string } | null;
  formula?: { op: 'multiply' | 'add' | 'subtract' | 'divide'; left: string; right: string } | null;
  sensitive?: boolean;
};

export type DatasetVisibility = 'private' | 'internal' | 'public';
export type SubmitAccess = 'staff' | 'authenticated' | 'students' | 'public';

export const SUBMIT_ACCESS_OPTIONS: Array<{
  value: SubmitAccess;
  label: string;
  hint: string;
}> = [
  {
    value: 'staff',
    label: 'Staff type into the table',
    hint: 'No public form. Your team adds rows in Data Workspace.',
  },
  {
    value: 'students',
    label: 'Official students fill the form',
    hint: 'Students see this on their dashboard and can submit. You still own the table.',
  },
  {
    value: 'authenticated',
    label: 'Anyone signed in fills the form',
    hint: 'Every signed-in account sees this on their dashboard, even if they did not create it.',
  },
  {
    value: 'public',
    label: 'Anyone with the link fills the form',
    hint: 'Share the public form. Signed-in people also see it on their dashboard.',
  },
];

export function submitAccessLabel(access: string): string {
  return SUBMIT_ACCESS_OPTIONS.find((o) => o.value === access)?.label || access;
}

export const FIELD_TYPE_LABELS: Record<DataFieldType, string> = {
  short_text: 'Short text',
  long_text: 'Long text',
  number: 'Number',
  email: 'Email',
  phone: 'Phone',
  date: 'Date',
  time: 'Time',
  datetime: 'Date & time',
  dropdown: 'Dropdown',
  multi_select: 'Multi-select',
  radio: 'Radio',
  checkbox: 'Checkboxes',
  yes_no: 'Yes / No',
  file: 'File',
  image: 'Image',
  url: 'URL',
  student: 'Student lookup',
  staff: 'Staff',
  campus: 'Campus',
  department: 'Department',
  faculty: 'Faculty',
  program: 'Program',
  course: 'Course',
  cohort: 'Cohort',
  class: 'Class',
  address: 'Address',
  country: 'Country',
  signature: 'Signature',
};

export function newFieldId() {
  return `f_${Math.random().toString(36).slice(2, 10)}`;
}

export function fieldKey(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40) || 'field';
}

export function makeField(partial: Partial<DataField> & { label: string; type: DataFieldType }): DataField {
  return {
    id: partial.id || newFieldId(),
    key: partial.key || fieldKey(partial.label),
    label: partial.label,
    description: partial.description || '',
    placeholder: partial.placeholder || '',
    type: (DATA_FIELD_TYPES as readonly string[]).includes(String(partial.type))
      ? partial.type
      : 'short_text',
    required: Boolean(partial.required),
    options: partial.options || [],
    min: partial.min ?? null,
    max: partial.max ?? null,
    minLength: partial.minLength ?? null,
    maxLength: partial.maxLength ?? null,
    defaultValue: partial.defaultValue || '',
    autoFrom: partial.autoFrom || null,
    showIf: partial.showIf || null,
    formula: partial.formula || null,
    sensitive: Boolean(partial.sensitive),
  };
}

export function isDataFieldType(value: string): value is DataFieldType {
  return (DATA_FIELD_TYPES as readonly string[]).includes(value);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\//i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}(?:[ T].*)?$|^\d{1,2}[/. -]\d{1,2}[/. -]\d{2,4}$/;
const YES_NO_RE = /^(yes|no|true|false|y|n|oui|non)$/i;

export function inferDropdownOptions(samples: string[]): string[] {
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const raw of samples) {
    const v = raw.trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(v);
    if (unique.length >= 24) break;
  }
  return unique;
}

/** Guess a column type from its header and sample cells (CSV import). */
export function inferFieldType(header: string, samples: string[]): DataFieldType {
  const label = header.toLowerCase();
  if (/e-?mail/.test(label)) return 'email';
  if (/phone|mobile|whatsapp|\btel\b/.test(label)) return 'phone';
  if (/\burl\b|website|\blink\b/.test(label)) return 'url';
  if (/\bdate\b|dob|birthday|born/.test(label)) return 'date';
  if (/\btime\b/.test(label) && !/date/.test(label)) return 'time';
  const vals = samples.map((s) => s.trim()).filter(Boolean);
  if (!vals.length) return 'short_text';
  if (vals.every((v) => EMAIL_RE.test(v))) return 'email';
  if (vals.every((v) => URL_RE.test(v))) return 'url';
  if (vals.every((v) => YES_NO_RE.test(v))) return 'yes_no';
  if (vals.every((v) => DATE_RE.test(v))) return 'date';
  const numeric = vals.every((v) => {
    const cleaned = v.replace(/[, ]/g, '');
    return cleaned !== '' && !Number.isNaN(Number(cleaned)) && /^-?[0-9]*\.?[0-9]+$/.test(cleaned);
  });
  if (numeric) return 'number';
  const avg = vals.reduce((n, v) => n + v.length, 0) / vals.length;
  if (avg > 90) return 'long_text';
  const unique = new Set(vals.map((v) => v.toLowerCase()));
  if (vals.length >= 8 && unique.size >= 2 && unique.size <= 8 && unique.size <= vals.length * 0.45) {
    return 'dropdown';
  }
  return 'short_text';
}

export type DatasetTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  statuses: string[];
  fields: Array<Partial<DataField> & { label: string; type: DataFieldType }>;
};

export const DATASET_TEMPLATES: DatasetTemplate[] = [
  {
    id: 'event',
    name: 'Event registration',
    description: 'Prospects, open days, conferences, career fairs.',
    category: 'Events',
    statuses: ['Registered', 'Confirmed', 'Attended', 'Cancelled'],
    fields: [
      { label: 'Full name', type: 'short_text', required: true, autoFrom: 'name' },
      { label: 'Email', type: 'email', required: true, autoFrom: 'email' },
      { label: 'Phone', type: 'phone', required: true },
      { label: 'Campus', type: 'campus' },
      { label: 'Department', type: 'department' },
      { label: 'Program', type: 'program', autoFrom: 'program' },
      { label: 'Are you attending?', type: 'yes_no', required: true },
      { label: 'Notes', type: 'long_text' },
    ],
  },
  {
    id: 'scholarship',
    name: 'Scholarship application',
    description: 'Collect and review scholarship applications.',
    category: 'Admissions',
    statuses: ['Submitted', 'Under review', 'Documents required', 'Awarded', 'Rejected'],
    fields: [
      { label: 'Full name', type: 'short_text', required: true, autoFrom: 'name' },
      { label: 'Email', type: 'email', required: true, autoFrom: 'email' },
      { label: 'Matricule', type: 'short_text', autoFrom: 'matricule' },
      { label: 'Program', type: 'program', required: true },
      { label: 'Level / year', type: 'short_text' },
      { label: 'Statement', type: 'long_text', required: true },
      { label: 'Supporting document', type: 'file' },
    ],
  },
  {
    id: 'internship',
    name: 'Internship application',
    description: 'Internship and placement applications.',
    category: 'Career',
    statuses: ['Submitted', 'Shortlisted', 'Placed', 'Rejected'],
    fields: [
      { label: 'Full name', type: 'short_text', required: true, autoFrom: 'name' },
      { label: 'Email', type: 'email', required: true, autoFrom: 'email' },
      { label: 'Phone', type: 'phone' },
      { label: 'Program', type: 'program' },
      { label: 'Preferred company', type: 'short_text' },
      { label: 'CV', type: 'file', required: true },
    ],
  },
  {
    id: 'survey',
    name: 'Feedback survey',
    description: 'Simple feedback or research form.',
    category: 'Surveys',
    statuses: ['Received'],
    fields: [
      { label: 'Name (optional)', type: 'short_text' },
      { label: 'Rating', type: 'dropdown', required: true, options: ['1', '2', '3', '4', '5'] },
      { label: 'What went well?', type: 'long_text' },
      { label: 'What should improve?', type: 'long_text' },
    ],
  },
  {
    id: 'visitor',
    name: 'Visitor registration',
    description: 'Walk-in and guest sign-in.',
    category: 'Operations',
    statuses: ['Signed in', 'Signed out'],
    fields: [
      { label: 'Full name', type: 'short_text', required: true },
      { label: 'Phone', type: 'phone', required: true },
      { label: 'Purpose', type: 'short_text', required: true },
      { label: 'Host / office', type: 'short_text' },
      { label: 'Visit date', type: 'date', required: true },
    ],
  },
  {
    id: 'student_reg',
    name: 'Student registration',
    description: 'Collect new or returning student details.',
    category: 'Admissions',
    statuses: ['Draft', 'Submitted', 'Under review', 'Accepted', 'Rejected', 'Waitlisted'],
    fields: [
      { label: 'Full name', type: 'short_text', required: true, autoFrom: 'name' },
      { label: 'Email', type: 'email', required: true, autoFrom: 'email' },
      { label: 'Phone', type: 'phone', required: true },
      { label: 'Campus', type: 'campus' },
      { label: 'Department', type: 'department' },
      { label: 'Program', type: 'program', required: true },
      { label: 'Year / level', type: 'short_text' },
    ],
  },
  {
    id: 'club',
    name: 'Club registration',
    description: 'Club and association membership.',
    category: 'Student life',
    statuses: ['Applied', 'Active', 'Inactive'],
    fields: [
      { label: 'Full name', type: 'short_text', required: true, autoFrom: 'name' },
      { label: 'Email', type: 'email', required: true },
      { label: 'Club / association', type: 'short_text', required: true },
      { label: 'Role of interest', type: 'dropdown', options: ['Member', 'Executive', 'Volunteer'] },
    ],
  },
  {
    id: 'conference',
    name: 'Conference registration',
    description: 'Delegates, speakers, and guests.',
    category: 'Events',
    statuses: ['Registered', 'Confirmed', 'Attended', 'Cancelled'],
    fields: [
      { label: 'Full name', type: 'short_text', required: true },
      { label: 'Email', type: 'email', required: true },
      { label: 'Organization', type: 'short_text' },
      { label: 'Role', type: 'dropdown', options: ['Delegate', 'Speaker', 'Exhibitor', 'Staff'] },
      { label: 'Dietary notes', type: 'short_text' },
    ],
  },
  {
    id: 'course_reg',
    name: 'Course registration',
    description: 'Sign-up for a course, training, or module.',
    category: 'Academic',
    statuses: ['Registered', 'Waitlisted', 'Enrolled', 'Dropped'],
    fields: [
      { label: 'Student', type: 'student', required: true },
      { label: 'Email', type: 'email', required: true, autoFrom: 'email' },
      { label: 'Course', type: 'course', required: true },
      { label: 'Program', type: 'program', autoFrom: 'program' },
    ],
  },
  {
    id: 'staff_reg',
    name: 'Staff registration',
    description: 'Internal staff or contractor records.',
    category: 'HR',
    statuses: ['Active', 'On leave', 'Former'],
    fields: [
      { label: 'Full name', type: 'short_text', required: true },
      { label: 'Email', type: 'email', required: true },
      { label: 'Phone', type: 'phone' },
      { label: 'Department', type: 'department' },
      { label: 'Role', type: 'short_text' },
    ],
  },
  {
    id: 'blank',
    name: 'Blank dataset',
    description: 'Start empty. Import a CSV or add your own columns.',
    category: 'Custom',
    statuses: ['New', 'In progress', 'Done'],
    fields: [],
  },
];
