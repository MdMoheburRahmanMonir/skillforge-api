"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogPosts = getBlogPosts;
exports.getBlogPostBySlug = getBlogPostBySlug;
exports.submitContact = submitContact;
const BlogPost_1 = require("../models/BlogPost");
async function getBlogPosts(_req, res) {
    const posts = await BlogPost_1.BlogPost.find().sort({ publishedAt: -1 });
    res.json({ posts });
}
async function getBlogPostBySlug(req, res) {
    const post = await BlogPost_1.BlogPost.findOne({ slug: req.params.slug });
    if (!post)
        return res.status(404).json({ message: "Blog post not found" });
    res.json({ post });
}
async function submitContact(req, res) {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: "Name, email, and message are required" });
    }
    res.json({ message: "Thank you for contacting SkillForge AI. We will respond within 24 hours.", received: { name, email, subject } });
}
