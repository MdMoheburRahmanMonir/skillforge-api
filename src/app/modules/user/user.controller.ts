import { db } from "../../db/mongodb";
import type { Request, Response } from "express";
import { ObjectId } from "mongodb";

export const getUsers = async (req: Request, res: Response) => {
    const users = await db.collection("user").find().toArray();
    res.status(200).json({
        success: true,
        data: users,
    });
};
export const postSkillForgeData = async (req: Request, res: Response) => {
    const data = req.body;
    const user = await db.collection("courses").insertOne({ ...data });
    res.status(201).json({
        success: true,
        data: user,
    });
};
export const GetUserAllData = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await db.collection("courses").find({ creatorId: id as string }).toArray();
    res.status(200).json({
        success: true,
        data: data,
    });
};
export const GetSingleCourseData = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await db.collection("courses").findOne({ _id: new ObjectId(id as string) });

    res.status(200).json({
        success: true,
        data,
    });
};
export const DeleteSingleCourseData = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await db.collection("courses").deleteOne({ _id: new ObjectId(id as string) });
    if (data.deletedCount === 1) {
        return res.send({ message: "Course deleted successfully", success: true });
    }

    res.send({ message: "Course not found", success: false });
};

export const PostAContactFormData = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await db.collection("contactData").insertOne({ ...req.body, createdAt: new Date() });
    res.status(201).json({
        success: true,
        data: data,
    });
};
 



