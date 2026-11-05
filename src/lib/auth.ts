import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI must be configured to use authentication.");
}

const globalForMongo = globalThis as typeof globalThis & {
  bookNookMongoClients?: Map<string, MongoClient>;
};

const bookNookMongoClients = globalForMongo.bookNookMongoClients ?? new Map();
let client = bookNookMongoClients.get(mongoUri);

if (!client) {
  client = new MongoClient(mongoUri);
  bookNookMongoClients.set(mongoUri, client);
}

const db = client.db("booknookserver");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client,
  }),
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [jwt({ sessionCookieCache: true })],
});