import type { NextFunction, Request, Response, } from 'express';
import { jwtVerify, createRemoteJWKSet } from 'jose'
import dotenv from "dotenv";
dotenv.config();

const JWKS = createRemoteJWKSet(
    new URL(`${process.env.BASE_URL}/api/auth/jwks`)
)

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
        const { payload } = await jwtVerify(token, JWKS) 
        next()
    } catch (error) {
        console.log(error);
        res.send({ error: "Unauthorized status code" })
    }
}