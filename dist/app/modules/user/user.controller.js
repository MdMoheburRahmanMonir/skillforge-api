"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.getSingleBlogPost = exports.getBlogsList = exports.getCategories = exports.getCoursesList = exports.PostAContactFormData = exports.DeleteSingleCourseData = exports.GetSingleCourseData = exports.GetUserAllData = exports.postSkillForgeData = exports.getUsers = void 0;
const mongodb_1 = require("../../db/mongodb");
const mongodb_2 = require("mongodb");
const getUsers = async (req, res) => {
    const users = await mongodb_1.db.collection("user").find().toArray();
    res.status(200).json({
        success: true,
        data: users,
    });
};
exports.getUsers = getUsers;
const postSkillForgeData = async (req, res) => {
    const data = req.body;
    const user = await mongodb_1.db.collection("courses").insertOne({ ...data });
    res.status(201).json({
        success: true,
        data: user,
    });
};
exports.postSkillForgeData = postSkillForgeData;
const GetUserAllData = async (req, res) => {
    const { id } = req.params;
    const data = await mongodb_1.db.collection("courses").find({ creatorId: id }).toArray();
    res.status(200).json({
        success: true,
        data: data,
    });
};
exports.GetUserAllData = GetUserAllData;
const GetSingleCourseData = async (req, res) => {
    const { id } = req.params;
    const data = await mongodb_1.db.collection("courses").findOne({ _id: new mongodb_2.ObjectId(id) });
    res.status(200).json({
        success: true,
        data,
    });
};
exports.GetSingleCourseData = GetSingleCourseData;
const DeleteSingleCourseData = async (req, res) => {
    const { id } = req.params;
    const data = await mongodb_1.db.collection("courses").deleteOne({ _id: new mongodb_2.ObjectId(id) });
    if (data.deletedCount === 1) {
        return res.send({ message: "Course deleted successfully", success: true });
    }
    res.send({ message: "Course not found", success: false });
};
exports.DeleteSingleCourseData = DeleteSingleCourseData;
const PostAContactFormData = async (req, res) => {
    const data = await mongodb_1.db.collection("contactData").insertOne({ ...req.body, createdAt: new Date() });
    res.status(201).json({
        success: true,
        data: data,
    });
};
exports.PostAContactFormData = PostAContactFormData;
const getCoursesList = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(24, parseInt(req.query.limit) || 12);
        const skip = (page - 1) * limit;
        const filter = {};
        const search = req.query.search;
        const category = req.query.category;
        const level = req.query.level;
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);
        const minRating = parseFloat(req.query.minRating);
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { shortDescription: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }
        if (category)
            filter.category = category;
        if (level)
            filter.level = level;
        if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            filter.price = {};
            if (!isNaN(minPrice))
                filter.price.$gte = minPrice;
            if (!isNaN(maxPrice))
                filter.price.$lte = maxPrice;
        }
        if (!isNaN(minRating))
            filter.rating = { $gte: minRating };
        let sortOption = { createdAt: -1 };
        const sort = req.query.sort;
        if (sort === "price-asc")
            sortOption = { price: 1 };
        else if (sort === "price-desc")
            sortOption = { price: -1 };
        else if (sort === "rating")
            sortOption = { rating: -1 };
        else if (sort === "title")
            sortOption = { title: 1 };
        const [courses, total] = await Promise.all([
            mongodb_1.db.collection("courses").find(filter).sort(sortOption).skip(skip).limit(limit).toArray(),
            mongodb_1.db.collection("courses").countDocuments(filter),
        ]);
        res.json({ courses, total, page, totalPages: Math.ceil(total / limit) });
    }
    catch (error) {
        console.error("getCoursesList error:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
};
exports.getCoursesList = getCoursesList;
const getCategories = async (_req, res) => {
    try {
        const categories = await mongodb_1.db.collection("courses").distinct("category");
        res.json({ categories });
    }
    catch (error) {
        console.error("getCategories error:", error);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};
exports.getCategories = getCategories;
const getBlogsList = async (_req, res) => {
    try {
        const posts = await mongodb_1.db.collection("blogposts").find().sort({ publishedAt: -1 }).toArray();
        res.json({ posts });
    }
    catch (error) {
        console.error("getBlogsList error:", error);
        res.status(500).json({ message: "Failed to fetch blog posts" });
    }
};
exports.getBlogsList = getBlogsList;
const getSingleBlogPost = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await mongodb_1.db.collection("blogposts").findOne({ slug });
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        res.json({ post });
    }
    catch (error) {
        console.error("getSingleBlogPost error:", error);
        res.status(500).json({ message: "Failed to fetch blog post" });
    }
};
exports.getSingleBlogPost = getSingleBlogPost;
const getStats = async (_req, res) => {
    try {
        const [totalCourses, categories, avgResult] = await Promise.all([
            mongodb_1.db.collection("courses").countDocuments(),
            mongodb_1.db.collection("courses").distinct("category"),
            mongodb_1.db.collection("courses").aggregate([
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
    }
    catch (error) {
        console.error("getStats error:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};
exports.getStats = getStats;
