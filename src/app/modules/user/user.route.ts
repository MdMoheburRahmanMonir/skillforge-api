import { Router } from "express";
import { DeleteSingleCourseData, getBlogsList, getCategories, getSingleBlogPost, GetSingleCourseData, getCoursesList, getStats, GetUserAllData, getUsers, PostAContactFormData, postSkillForgeData } from "./user.controller.js";
import { classify } from "../ai/ai.controller.js";
import { VerifyJWT } from "../../middlewares/verifyJWT.js";


const router = Router();

router.get("/", getUsers);
router.get("/courses", getCoursesList);
router.get("/courses/categories", getCategories);
router.get("/courses/stats", getStats);
router.post("/courses", postSkillForgeData);
router.get("/courses/my/:id", GetUserAllData);
router.get("/courses/:id", GetSingleCourseData);
router.delete("/courses/:id", DeleteSingleCourseData);
router.get("/blogs", getBlogsList);
router.get("/blogs/:slug", getSingleBlogPost);
router.post("/blogs/contact", PostAContactFormData);
router.post("/ai/classify", classify);

export default router;