"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let client = null;
function getClient() {
    if (!client) {
        client = (0, jwks_rsa_1.default)({
            jwksUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/jwks`,
        });
    }
    return client;
}
function getKey(header, callback) {
    getClient().getSigningKey(header.kid, (err, key) => {
        if (err)
            return callback(err);
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
}
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, getKey, { algorithms: ['EdDSA'] }, (err, decoded) => {
            if (err)
                return reject(err);
            resolve(decoded);
        });
    });
}
const VerifyJWT = async (req, res, next) => {
    const userToken = req?.headers?.authorization;
    if (!userToken) {
        return res.status(401).json({ error: "Unauthorized x1" });
    }
    const token = userToken.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized x2" });
    }
    try {
        const payload = await verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        console.log("JWT verification failed:", error);
        return res.status(401).json({ error: "Unauthorized x3" });
    }
};
exports.VerifyJWT = VerifyJWT;
