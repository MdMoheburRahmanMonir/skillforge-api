import { Router } from "express";
import { DeleteSingleCourseData, getBlogsList, getCategories, getSingleBlogPost, GetSingleCourseData, getCoursesList, getStats, GetUserAllData, getUsers, PostAContactFormData, postSkillForgeData } from "./user.controller.js";
import { VerifyJWT } from "../../middlewares/verifyJWT.js";


const router = Router();

router.get("/", getUsers);
router.get("/courses", getCoursesList);
router.get("/courses/categories", getCategories);
router.get("/courses/stats", getStats);
router.post("/courses", VerifyJWT, postSkillForgeData);
router.get("/courses/my/:id", VerifyJWT, GetUserAllData);
router.get("/courses/:id", GetSingleCourseData);
router.delete("/courses/:id", VerifyJWT, DeleteSingleCourseData);
router.get("/blogs", getBlogsList);
router.get("/blogs/:slug", getSingleBlogPost);
router.post("/blogs/contact", VerifyJWT, PostAContactFormData);

export default router;