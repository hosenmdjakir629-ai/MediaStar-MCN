import express from "express";
import apiRouter from "../server/routes/api.ts";

const app = express();

app.use(express.json());

// Mount API Routes
app.use("/api", apiRouter);

export default app;
