"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_js_1 = __importDefault(require("./app.js"));
const mongodb_js_1 = require("./app/db/mongodb.js");
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await (0, mongodb_js_1.connectDB)();
        app_js_1.default.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
    }
}
startServer();
