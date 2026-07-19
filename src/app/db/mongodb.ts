import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGO_DB_URI is not defined");
}

const client = new MongoClient(uri);

export const db = client.db(process.env.DB_NAME);

export const connectDB = async () => {
    await client.connect();

    console.log("✅ MongoDB Connected Successfully");
};