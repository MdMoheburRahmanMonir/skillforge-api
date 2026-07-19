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
    const data = await db.collection("contactData").insertOne({ ...req.body, createdAt: new Date() });
    res.status(201).json({
        success: true,
        data: data,
    });
};

export const getCoursesList = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(24, parseInt(req.query.limit as string) || 12);
        const skip = (page - 1) * limit;

        const filter: Record<string, unknown> = {};

        const search = req.query.search as string;
        const category = req.query.category as string;
        const level = req.query.level as string;
        const minPrice = parseFloat(req.query.minPrice as string);
        const maxPrice = parseFloat(req.query.maxPrice as string);
        const minRating = parseFloat(req.query.minRating as string);

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { shortDescription: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }
        if (category) filter.category = category;
        if (level) filter.level = level;
        if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            filter.price = {};
            if (!isNaN(minPrice)) (filter.price as Record<string, unknown>).$gte = minPrice;
            if (!isNaN(maxPrice)) (filter.price as Record<string, unknown>).$lte = maxPrice;
        }
        if (!isNaN(minRating)) filter.rating = { $gte: minRating };

        let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
        const sort = req.query.sort as string;
        if (sort === "price-asc") sortOption = { price: 1 };
        else if (sort === "price-desc") sortOption = { price: -1 };
        else if (sort === "rating") sortOption = { rating: -1 };
        else if (sort === "title") sortOption = { title: 1 };

        const [courses, total] = await Promise.all([
            db.collection("courses").find(filter).sort(sortOption).skip(skip).limit(limit).toArray(),
            db.collection("courses").countDocuments(filter),
        ]);

        res.json({ courses, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        console.error("getCoursesList error:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
};

export const getCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await db.collection("courses").distinct("category");
        res.json({ categories });
    } catch (error) {
        console.error("getCategories error:", error);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};

export const getBlogsList = async (_req: Request, res: Response) => {
    try {
        const posts = await db.collection("blogposts").find().sort({ publishedAt: -1 }).toArray();
        res.json({ posts });
    } catch (error) {
        console.error("getBlogsList error:", error);
        res.status(500).json({ message: "Failed to fetch blog posts" });
    }
};

export const getSingleBlogPost = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const post = await db.collection("blogposts").findOne({ slug });
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json({ post });
    } catch (error) {
        console.error("getSingleBlogPost error:", error);
        res.status(500).json({ message: "Failed to fetch blog post" });
    }
};

export const getStats = async (_req: Request, res: Response) => {
    try {
        const [totalCourses, categories, avgResult] = await Promise.all([
            db.collection("courses").countDocuments(),
            db.collection("courses").distinct("category"),
            db.collection("courses").aggregate([
                { $group: { _id: null, avg: { $avg: "$rating" } } },
            ]).toArray(),
        ]);

        const averageRating = avgResult.length > 0
            ? avgResult[0].avg.toFixed(1)
            : "4.8";

        const monthlyEnrollments = [
            { month: "Jan", enrollments: 420 },
            { month: "Feb", enrollments: 580 },
            { month: "Mar", enrollments: 710 },
            { month: "Apr", enrollments: 890 },
            { month: "May", enrollments: 1020 },
            { month: "Jun", enrollments: 1180 },
        ];

        res.json({
            totalCourses,
            totalCategories: categories.length,
            averageRating,
            totalStudents: 12500,
            monthlyEnrollments,
            categories: categories.slice(0, 8),
        });
    } catch (error) {
        console.error("getStats error:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};



