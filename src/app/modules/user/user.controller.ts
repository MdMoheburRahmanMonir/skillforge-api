import { db } from "../../db/mongodb";
import type { Request, Response } from "express";


export const getUsers = async (req: Request, res: Response) => {
    const users = await db.collection("users").find().toArray();
    res.status(200).json({
        success: true,
        data: users,
    });
};