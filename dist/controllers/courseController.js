"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidation = void 0;
exports.getCourses = getCourses;
exports.getCourseById = getCourseById;
exports.createCourse = createCourse;
exports.deleteCourse = deleteCourse;
exports.getMyCourses = getMyCourses;
exports.getCategories = getCategories;
exports.getStats = getStats;
const express_validator_1 = require("express-validator");
const Course_1 = require("../models/Course");
const Review_1 = require("../models/Review");
exports.courseValidation = [
    (0, express_validator_1.body)("title").trim().notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("shortDescription").trim().notEmpty().withMessage("Short description is required"),
    (0, express_validator_1.body)("fullDescription").trim().notEmpty().withMessage("Full description is required"),
    (0, express_validator_1.body)("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
    (0, express_validator_1.body)("category").trim().notEmpty().withMessage("Category is required"),
    (0, express_validator_1.body)("duration").trim().notEmpty().withMessage("Duration is required"),
    (0, express_validator_1.body)("instructor").trim().notEmpty().withMessage("Instructor is required"),
    (0, express_validator_1.body)("courseImage").trim().notEmpty().withMessage("Course image URL is required"),
];
async function getCourses(req, res) {
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
    const sort = req.query.sort || "newest";
    if (search)
        filter.$text = { $search: search };
    if (category && category !== "all")
        filter.category = category;
    if (level && level !== "all")
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
    if (sort === "price-asc")
        sortOption = { price: 1 };
    else if (sort === "price-desc")
        sortOption = { price: -1 };
    else if (sort === "rating")
        sortOption = { rating: -1 };
    else if (sort === "title")
        sortOption = { title: 1 };
    const [courses, total] = await Promise.all([
        Course_1.Course.find(filter).sort(sortOption).skip(skip).limit(limit),
        Course_1.Course.countDocuments(filter),
    ]);
    res.json({ courses, total, page, totalPages: Math.ceil(total / limit) });
}
async function getCourseById(req, res) {
    const course = await Course_1.Course.findById(req.params.id);
    if (!course)
        return res.status(404).json({ message: "Course not found" });
    const reviews = await Review_1.Review.find({ courseId: course._id }).sort({ createdAt: -1 }).limit(20);
    const related = await Course_1.Course.find({
        _id: { $ne: course._id },
        category: course.category,
    }).limit(4);
    res.json({ course, reviews, related });
}
async function createCourse(req, res) {
    const course = await Course_1.Course.create({
        ...req.body,
        images: req.body.images || [req.body.courseImage],
        tags: req.body.tags || [],
        // createdBy: req.user!._id,
    });
    res.status(201).json({ course });
}
async function deleteCourse(req, res) {
    const course = await Course_1.Course.findById(req.params.id);
    if (!course)
        return res.status(404).json({ message: "Course not found" });
    if (course.createdBy?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this course" });
    }
    await Review_1.Review.deleteMany({ courseId: course._id });
    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
}
async function getMyCourses(req, res) {
    const courses = await Course_1.Course.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ courses });
}
async function getCategories(_req, res) {
    const categories = await Course_1.Course.distinct("category");
    res.json({ categories });
}
async function getStats(_req, res) {
    const [totalCourses, categories, avgRating] = await Promise.all([
        Course_1.Course.countDocuments(),
        Course_1.Course.distinct("category"),
        Course_1.Course.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
    ]);
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
        averageRating: avgRating[0]?.avg?.toFixed(1) || "4.8",
        totalStudents: 12500,
        monthlyEnrollments,
        categories: categories.slice(0, 8),
    });
}
