"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogController_1 = require("../controllers/blogController");
const router = (0, express_1.Router)();
router.get("/", blogController_1.getBlogPosts);
router.get("/:slug", blogController_1.getBlogPostBySlug);
router.post("/contact", blogController_1.submitContact);
exports.default = router;
