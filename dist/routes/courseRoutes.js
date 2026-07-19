"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const courseController_1 = require("../controllers/courseController");
const router = (0, express_1.Router)();
router.get("/", auth_1.optionalAuth, courseController_1.getCourses);
router.get("/stats", courseController_1.getStats);
router.get("/categories", courseController_1.getCategories);
router.get("/my", auth_1.authMiddleware, courseController_1.getMyCourses);
router.get("/:id", auth_1.optionalAuth, courseController_1.getCourseById);
router.post("/", auth_1.authMiddleware, 
// courseValidation,
// validate,
courseController_1.createCourse);
router.delete("/:id", auth_1.authMiddleware, courseController_1.deleteCourse);
exports.default = router;
