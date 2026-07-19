import { Router } from "express";
import userRouter from "../modules/user/user.route.js";

const router = Router();

router.use("/", userRouter);

export default router;