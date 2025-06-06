import { Router } from "express";
import upload from "../../config/multerConfig";
import {
  loginHandler,
  logOutHandler,
  refreshHandler,
  registerHandler,
} from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/register", upload.single("profileImage"), registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.post("/logout", logOutHandler);
authRoutes.post("/refresh", refreshHandler);

export default authRoutes;
