import { createConnection } from "mongoose";

export const conn = createConnection(
  "mongodb+srv://" +
  process.env.MONGODB_USERNAME +
  ":" +
  process.env.MONGODB_PASSWORD +
  "@" +
  process.env.MONGODB_URI
);