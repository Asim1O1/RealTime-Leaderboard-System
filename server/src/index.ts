import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { initializeCloudinary } from "./config/cloudinaryConfig";
import { APP_ORIGIN, PORT } from "./constants/env";
import { OK } from "./constants/http";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./modules/auth/auth.route";
import leaderboardRouter from "./modules/leaderboard/leaderboard.route";
import scoreRouter from "./modules/score/score.route";

const app: Express = express();

// Middleware to parse JSON bodies and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS with specific origin and credentials support
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

// Parse cookies from incoming requests
app.use(cookieParser());

initializeCloudinary();

// Health check endpoint

app.get("/", (req: Request, res: Response) => {
  res.status(OK).json({
    status: "success",
    message: "Server is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRouter);
app.use("/api/leaderboard", leaderboardRouter);

// Central error handling middleware (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
