"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const validate_1 = require("./middleware/validate");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "SkillForge API", timestamp: new Date().toISOString() });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/courses", courseRoutes_1.default);
app.use("/api/ai", aiRoutes_1.default);
app.use("/api/blogs", blogRoutes_1.default);
app.use(validate_1.errorHandler);
async function start() {
    const uri = process.env.MONGODB_URI;
    await (0, db_1.connectDB)(uri);
    app.listen(PORT, () => console.log(`SkillForge API running on port ${PORT}`));
}
start().catch(console.error);
