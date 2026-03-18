import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;

if (!uri) {
  throw new Error("Please define the MONGODB_URL environment variable");
}

const client = new MongoClient(uri);
let clientPromise: Promise<MongoClient>;
clientPromise = client.connect();

export default clientPromise;
