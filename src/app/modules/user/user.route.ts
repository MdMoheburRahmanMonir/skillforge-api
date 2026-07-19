import { Router } from "express";
import { DeleteSingleCourseData, GetSingleCourseData, GetUserAllData, getUsers, PostAContactFormData, postSkillForgeData } from "./user.controller.js";
import { VerifyJWT } from "../../middlewares/verifyJWT.js";


const router = Router();

router.get("/", getUsers);
router.post("/courses", VerifyJWT, postSkillForgeData);
router.get("/courses/my/:id", VerifyJWT, GetUserAllData);
router.get("/courses/:id", GetSingleCourseData);
router.delete("/courses/:id", VerifyJWT, DeleteSingleCourseData);
router.post("/blogs/contact", VerifyJWT, PostAContactFormData);

export default router;