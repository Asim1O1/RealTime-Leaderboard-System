import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().min(1).max(255),
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});
export const loginSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(100),
  userAgent: z.string().optional(),
});
