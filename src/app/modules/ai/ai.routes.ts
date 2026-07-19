import { Router } from "express";
import { VerifyJWT } from "../../middlewares/verifyJWT.js";
import {
  chat,
  streamChat,
  generate,
  recommendations,
  classify,
} from "./ai.controller.js";

const router = Router();

router.post("/chat", VerifyJWT, chat);
router.post("/chat/stream", VerifyJWT, streamChat);
router.post("/generate", VerifyJWT, generate);
router.get("/recommendations", VerifyJWT, recommendations);
router.post("/classify", VerifyJWT, classify);

export default router;
