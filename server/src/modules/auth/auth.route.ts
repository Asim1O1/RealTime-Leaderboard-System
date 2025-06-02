import { Router } from "express";
import upload from "../../config/multerConfig";
import {
  loginHandler,
  logOutHandler,
  registerHandler,
} from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/register", upload.single("profileImage"), registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.post("/logout", logOutHandler);

export default authRoutes;
