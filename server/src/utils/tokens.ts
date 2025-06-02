import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

interface TokenPayload {
  userId: number;
  email: string;
  username: string;
}

const generateTokens = (payload: TokenPayload) => {
  const commonOptions = {
    algorithm: "HS256" as const,
    issuer: "leaderboard-app",
    audience: ["user"],
    subject: payload.userId.toString(),
    jwtid: uuidv4(),
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    ...commonOptions,
    expiresIn: "15m", // Short-lived access token
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    ...commonOptions,
    expiresIn: "30d", // Longer-lived refresh token
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return { payload, error: null };
  } catch (error) {
    return { payload: null, error: (error as Error).message };
  }
};

export default generateTokens;
