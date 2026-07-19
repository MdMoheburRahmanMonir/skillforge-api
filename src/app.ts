import express from "express";
import routes from "./app/routes/index.js";
import aiRouter from "./app/modules/ai/ai.routes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", routes);
app.use("/ai", aiRouter);

export default app;