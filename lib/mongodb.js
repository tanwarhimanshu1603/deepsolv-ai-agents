import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
// console.log("URI", uri);
let clientPromise;

if (process.env.NODE_ENV === "development" && !global._mongoClientPromise) {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
  console.log("Connection successful");
}

// Use the global promise if available, otherwise create a new one
clientPromise = global._mongoClientPromise || new MongoClient(uri).connect();

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
