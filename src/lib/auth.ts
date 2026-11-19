import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("mentorlagbe_db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
    emailAndPassword: { 
    enabled: true, 
  }, 

  plugins: [
        jwt(), 
    ],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      strategy: 'jwt',
    }

  },

   user: {
       additionalFields: {
          role: {
              type: "string",
              required: true,
              defaultValue: "student",
              input: true,
            } 
        }
    },


});