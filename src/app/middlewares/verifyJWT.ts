import type { NextFunction, Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();

let JWKS: ReturnType<typeof import('jose').createRemoteJWKSet> | null = null;

async function getJWKS() {
    if (!JWKS) {
        const { createRemoteJWKSet } = await import('jose');
        JWKS = createRemoteJWKSet(
            new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/jwks`)
        );
    }
    return JWKS;
}

export const VerifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const userToken = req?.headers?.authorization;
    if (!userToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = userToken.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const { jwtVerify } = await import('jose');
        const jwks = await getJWKS();
        const { payload } = await jwtVerify(token, jwks);
        (req as any).user = payload;
        next();
    } catch (error) {
        console.log("JWT verification failed:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
};