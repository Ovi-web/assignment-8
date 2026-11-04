import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI must be configured to use authentication.");
}

const globalForMongo = globalThis as typeof globalThis & {
  bookNookMongoClients?: Map<string, MongoClient>;
};

const mongoClients = (globalForMongo.bookNookMongoClients ??= new Map());
let client = mongoClients.get(mongoUri);

if (!client) {
  client = new MongoClient(mongoUri);
  mongoClients.set(mongoUri, client);
}

const db = client.db("booknookserver");
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
});