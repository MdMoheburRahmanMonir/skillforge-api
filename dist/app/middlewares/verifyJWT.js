"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyJWT = void 0;
const jose_1 = require("jose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWKS = (0, jose_1.createRemoteJWKSet)(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/jwks`));
const VerifyJWT = async (req, res, next) => {
    const userToken = req?.headers?.authorization;
    if (!userToken) {
        return res.status(401).send({ error: "Unauthorized status code" });
    }
    const token = userToken.split(" ")[1];
    if (!token) {
        return res.status(401).send({ error: "Unauthorized status code" });
    }
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, JWKS);
        next();
    }
    catch (error) {
        console.log(error);
        res.send({ error: "Unauthorized status code" });
    }
};
exports.VerifyJWT = VerifyJWT;
