import type { NextFunction, Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();

let JWKS: any = null;

export const VerifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const userToken = req?.headers?.authorization;
    if (!userToken) {
        return res.status(401).send({ error: "Unauthorized status code" });
    }
    const token = userToken.split(" ")[1];
    if (!token) {
        return res.status(401).send({ error: "Unauthorized status code" });
    }
    try {
        const jose = await import('jose');
        if (!JWKS) {
            JWKS = jose.createRemoteJWKSet(
                new URL(`${process.env.BASE_URL}/api/auth/jwks`)
            );
        }
        const { payload } = await jose.jwtVerify(token, JWKS);
        next();
    } catch (error) {
        console.log(error);
        res.send({ error: "Unauthorized status code" });
    }
}