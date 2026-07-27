import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connect(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    return Promise.reject(
      new Error("Please define the MONGODB_URL environment variable"),
    );
  }
  return new MongoClient(uri).connect();
}

/**
 * Thenable Mongo client promise.
 * Connection is deferred until first await so `next build` can import API
 * routes without requiring MONGODB_URL at module-evaluation time.
 */
const clientPromise = {
  then<TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connect();
    }
    return global._mongoClientPromise.then(onfulfilled, onrejected);
  },
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ) {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connect();
    }
    return global._mongoClientPromise.catch(onrejected);
  },
} as Promise<MongoClient>;

export default clientPromise;
