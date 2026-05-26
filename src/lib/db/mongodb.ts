import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient>;

if (!uri) {
  // Return a dummy promise that rejects with a clear error at query time
  clientPromise = Promise.reject(new Error("MONGODB_URI is not configured"));
} else if (process.env.NODE_ENV === "development") {
  // In dev, reuse the connection across hot reloads
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;

export async function getDb(dbName = "beautyrooms") {
  const client = await clientPromise;
  return client.db(dbName);
}
