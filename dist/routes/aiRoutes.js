"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const aiController_1 = require("../controllers/aiController");
const router = (0, express_1.Router)();
router.post("/chat", 
// authMiddleware,
aiController_1.chat);
router.post("/chat/stream", auth_1.authMiddleware, aiController_1.chatStream);
router.get("/conversations", auth_1.authMiddleware, aiController_1.getConversations);
router.post("/generate", auth_1.authMiddleware, aiController_1.generateContent);
router.get("/recommendations", auth_1.authMiddleware, aiController_1.getRecommendations);
router.post("/classify", auth_1.authMiddleware, aiController_1.classifyContent);
exports.default = router;
