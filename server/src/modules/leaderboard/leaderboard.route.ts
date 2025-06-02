import { Router } from "express";

import authenticate from "../../middlewares/authenticate";
import {
  getLeaderboardHandler,
  getUserRankHandler,
} from "./leaderboard.controller";

const leaderboardRouter = Router();

// Get top leaderboard scores (public or authenticated, up to you)
leaderboardRouter.get("/top", getLeaderboardHandler);

// Get logged-in user's rank
leaderboardRouter.get("/rank", authenticate, getUserRankHandler);

export default leaderboardRouter;
