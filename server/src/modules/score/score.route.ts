import Router from "express";
import authenticate from "../../middlewares/authenticate";
import { getMyScoresHandler, submitScoreHandler } from "./score.controller";

const scoreRouter = Router();

scoreRouter.post("/submit", authenticate, submitScoreHandler);
scoreRouter.get("/my-scores", authenticate, getMyScoresHandler);

export default scoreRouter;
