import { z } from "zod";

export const regsiterSchema = z.object({
  email: z.string().email().min(1).max(255),
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});
