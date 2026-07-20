"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyJWT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let JWKS = null;
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
        const jose = await Promise.resolve().then(() => __importStar(require('jose')));
        if (!JWKS) {
            JWKS = jose.createRemoteJWKSet(new URL(`${process.env.BASE_URL}/api/auth/jwks`));
        }
        const { payload } = await jose.jwtVerify(token, JWKS);
        next();
    }
    catch (error) {
        console.log(error);
        res.send({ error: "Unauthorized status code" });
    }
};
exports.VerifyJWT = VerifyJWT;
