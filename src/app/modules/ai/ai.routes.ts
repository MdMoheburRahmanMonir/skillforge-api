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

router.post("/chat", chat);
router.post("/chat/stream", streamChat);
router.post("/generate", generate);
router.get("/recommendations", recommendations);
router.post("/classify", classify);

export default router;
