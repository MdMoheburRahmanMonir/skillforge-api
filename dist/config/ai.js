"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_MODEL = exports.aiClient = void 0;
exports.hasAIKey = hasAIKey;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.aiClient = new openai_1.default({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env.AI_BASE_URL,
});
exports.AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
function hasAIKey() {
    return Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY !== "demo-key");
}
