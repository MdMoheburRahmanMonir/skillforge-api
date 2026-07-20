import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import dotenv from "dotenv";
dotenv.config();

let client: ReturnType<typeof jwksClient> | null = null;

function getClient() {
    if (!client) {
        client = jwksClient({
            jwksUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/jwks`,
        });
    }
    return client;
}

function getKey(header: jwt.JwtHeader, callback: (err: Error | null, key?: string) => void) {
    getClient().getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
}

function verifyToken(token: string): Promise<jwt.JwtPayload> {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            getKey,
            { algorithms: ['EdDSA'] as unknown as jwt.Algorithm[] },
            (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded as jwt.JwtPayload);
            }
        );
    });
}

export const VerifyJWT = async (req: Request, res: Response, next: NextFunction) => {
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
        (req as any).user = payload;
        next();
    } catch (error) {
        console.log("JWT verification failed:", error);
        return res.status(401).json({ error: "Unauthorized x3" });
    }
};