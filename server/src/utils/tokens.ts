import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

const generateTokens = (payload: {
  userId: number;
  email: string;
  username: string;
}) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    audience: ["user"],
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    audience: ["user"],
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

export default generateTokens;
