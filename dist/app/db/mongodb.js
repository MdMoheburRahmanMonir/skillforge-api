"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGO_DB_URI is not defined");
}
const client = new mongodb_1.MongoClient(uri);
exports.db = client.db(process.env.DB_NAME);
const connectDB = async () => {
    await client.connect();
    console.log("✅ MongoDB Connected Successfully");
};
exports.connectDB = connectDB;
