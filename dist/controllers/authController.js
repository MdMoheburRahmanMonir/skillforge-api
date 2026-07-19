"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
exports.register = register;
exports.login = login;
exports.demoLogin = demoLogin;
exports.getMe = getMe;
exports.updateInterests = updateInterests;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
dotenv_1.default.config();
function signToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || "secret", {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d"),
    });
}
exports.registerValidation = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
async function register(req, res) {
    const { name, email, password } = req.body;
    const existing = await User_1.User.findOne({ email });
    if (existing)
        return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcryptjs_1.default.hash(password, 12);
    const user = await User_1.User.create({ name, email, password: hashed });
    const token = signToken(user._id.toString());
    res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, interests: user.interests },
    });
}
async function login(req, res) {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email });
    if (!user || !user.password)
        return res.status(401).json({ message: "Invalid credentials" });
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user._id.toString());
    res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, interests: user.interests },
    });
}
async function demoLogin(_req, res) {
    const email = process.env.DEMO_EMAIL || "demo@skillforge.ai";
    const password = process.env.DEMO_PASSWORD || "Demo@12345";
    let user = await User_1.User.findOne({ email });
    if (!user) {
        const hashed = await bcryptjs_1.default.hash(password, 12);
        user = await User_1.User.create({
            name: "Demo User",
            email,
            password: hashed,
            interests: ["Web Development", "Data Science", "AI"],
        });
    }
    const token = signToken(user._id.toString());
    res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, interests: user.interests },
        demoCredentials: { email, password },
    });
}
async function getMe(req, res) {
    res.json({ user: req.user });
}
async function updateInterests(req, res) {
    const { interests } = req.body;
    if (!Array.isArray(interests))
        return res.status(400).json({ message: "Interests must be an array" });
    const user = await User_1.User.findByIdAndUpdate(req.user._id, { interests }, { new: true }).select("-password");
    res.json({ user });
}
