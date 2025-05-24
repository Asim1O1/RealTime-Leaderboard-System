import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { APP_ORIGIN, PORT } from "./constants/env";
import { OK } from "./constants/http";
import errorHandler from "./middlewares/errorHandler";

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

// Health check endpoint

app.get("/", (req: Request, res: Response) => {
  res.status(OK).json({
    status: "success",
    message: "Server is running",
  });
});

// Central error handling middleware (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
