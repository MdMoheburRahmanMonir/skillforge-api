"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuth = optionalAuth;
const dotenv_1 = __importDefault(require("dotenv"));
const jose_1 = require("jose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
dotenv_1.default.config();
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");
const JWKS = BETTER_AUTH_URL
    ? (0, jose_1.createRemoteJWKSet)(new URL(`${BETTER_AUTH_URL}/api/auth/jwks`))
    : null;
async function findOrCreateUser(payload) {
    const candidateIds = [payload.userId, payload.sub, payload.id].filter(Boolean);
    for (const value of candidateIds) {
        const user = await User_1.User.findById(value).select("-password");
        if (user)
            return user;
    }
    if (payload.email) {
        const normalizedEmail = payload.email.toLowerCase();
        const existingUser = await User_1.User.findOne({ email: normalizedEmail }).select("-password");
        if (existingUser)
            return existingUser;
        const createdUser = await User_1.User.create({
            name: payload.name || normalizedEmail.split("@")[0],
            email: normalizedEmail,
            avatar: payload.image || payload.picture,
            interests: [],
        });
        return createdUser;
    }
    return null;
}
async function verifyAndGetUser(token) {
    try {
        const localPayload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        return await findOrCreateUser(localPayload);
    }
    catch {
        // Fall back to Better Auth/JWKS verification.
    }
    if (!JWKS)
        return null;
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, JWKS);
        return await findOrCreateUser(payload);
    }
    catch {
        return null;
    }
}
async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const user = await verifyAndGetUser(token);
        if (!user)
            return res.status(401).json({ message: "User not found" });
        req.user = user;
        next();
    }
    catch (err) {
        console.error("Auth verification failed:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
async function optionalAuth(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;
    if (!token)
        return next();
    try {
        const user = await verifyAndGetUser(token);
        if (user)
            req.user = user;
        next();
    }
    catch {
        next();
    }
}
