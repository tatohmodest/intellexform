import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connect(): Promise<MongoClient> {
  const uri = (process.env.MONGODB_URL || process.env.MONGODB_URI || "").trim();
  if (!uri) {
    return Promise.reject(
      new Error("Please define the MONGODB_URL environment variable"),
    );
  }
  return new MongoClient(uri, {
    serverSelectionTimeoutMS: 8_000,
    connectTimeoutMS: 8_000,
  })
    .connect()
    .catch((err) => {
      // Never cache a failed connection promise across future requests.
      global._mongoClientPromise = undefined;
      throw err;
    });
}

function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect();
  }
  return global._mongoClientPromise;
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
    return getClientPromise().then(onfulfilled, onrejected);
  },
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ) {
    return getClientPromise().catch(onrejected);
  },
} as Promise<MongoClient>;

export default clientPromise;
