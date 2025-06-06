import express from "express";
import upload from "../../config/multerConfig";
import authenticate from "../../middlewares/authenticate";
import {
  deleteUserAccount,
  getUserProfile,
  updateUserProfile,
} from "./user.controller";

const userRoutes = express.Router();

userRoutes.get("/profile", authenticate, getUserProfile);
userRoutes.put(
  "/profile",
  authenticate,
  upload.single("profileImage"),
  updateUserProfile
);
userRoutes.delete("/profile", authenticate, deleteUserAccount);

export default userRoutes;
