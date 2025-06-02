import Router from "express";
import authenticate from "../../middlewares/authenticate";
import { submitScoreHandler } from "./score.controller";

const scoreRouter = Router();

scoreRouter.post("/submit", authenticate, submitScoreHandler);

export default scoreRouter;
