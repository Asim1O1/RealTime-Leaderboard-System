import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from "../../constants/env";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  OK,
  UNAUTHORIZED,
} from "../../constants/http";
import { loginSchema, registerSchema } from "../../schemas/auth.schema";
import appAssert from "../../utils/appAssert";
import { comparePassword } from "../../utils/auth";
import { hashValue } from "../../utils/bcrypt";
import bufferToStream from "../../utils/buffertToStream";
import catchErrors from "../../utils/catchErrors";
import { clearAuthCookies, setAuthCookies } from "../../utils/cookies";
import prisma from "../../utils/prisma";
import generateTokens from "../../utils/tokens";

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse(req.body);
  const { email, username, password } = request;

  // Check for existing user
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  appAssert(
    !existingUser,
    CONFLICT,
    "User already exists with this email or username"
  );

  const hashedPassword = await hashValue(password, 12);

  // Optional image upload
  let profileImageUrl: string | undefined;
  if (req.file) {
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user-profiles" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string });
          }
        );

        bufferToStream(req.file!.buffer).pipe(stream);
      }
    );

    profileImageUrl = uploadResult.secure_url;
  }

  // Create user
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      profileImage: profileImageUrl,
    },
  });

  const { accessToken, refreshToken } = generateTokens({
    userId: newUser.id,
    email: newUser.email,
    username: newUser.username,
  });

  setAuthCookies({ res, accessToken, refreshToken });

  res.status(CREATED).json({
    success: true,
    message: "User registered and logged in successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      profileImage: newUser.profileImage,
      createdAt: newUser.createdAt,
    },
  });
});

export const loginHandler = catchErrors(async (req, res) => {
  // Validate request body against login schema
  const request = loginSchema.parse(req.body);
  const { email, password } = request;

  /**
   * TIMING ATTACK PROTECTION:
   * Always hash a dummy value even if user doesn't exist
   * Prevents attackers from detecting valid emails via response time differences
   */
  const dummyHash = await hashValue("dummy", 10);

  // Find user by email (case-sensitive search)
  const user = await prisma.user.findUnique({
    where: { email },
  });

  /**
   * Compare provided password with stored hash (or dummy hash)
   * Uses constant-time comparison to prevent timing attacks
   */
  const passwordToCompare = user?.password || dummyHash;
  const isPasswordValid = await comparePassword(password, passwordToCompare);

  /**
   * SECURITY NOTE:
   * Using identical error messages prevents user enumeration
   * Don't reveal whether email exists or password was wrong
   */
  appAssert(user && isPasswordValid, UNAUTHORIZED, "Invalid credentials");

  /**
   * Generate new JWT tokens
   * Access token: Short-lived (15-30 mins typical)
   * Refresh token: Longer-lived (7-30 days typical)
   */
  const { accessToken, refreshToken } = generateTokens({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  // Set secure cookies with tokens
  setAuthCookies({
    res,
    accessToken,
    refreshToken,
  });

  // Return 200 OK with user data (excluding sensitive fields)
  res.status(OK).json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      profileImage: user.profileImage, // Optional profile image
    },
  });
});

export const logOutHandler = catchErrors(async (req, res) => {
  clearAuthCookies(res);

  res.status(OK).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  appAssert(refreshToken, UNAUTHORIZED, "Refresh token missing");

  let decoded: jwt.JwtPayload;
  try {
    decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as jwt.JwtPayload;
  } catch (err) {
    throw new Error("Invalid refresh token");
  }

  appAssert(
    decoded.userId && decoded.email && decoded.username,
    BAD_REQUEST,
    "Malformed refresh token"
  );

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, username: true },
  });
  appAssert(user, UNAUTHORIZED, "User no longer exists");

  const { accessToken, refreshToken: newRefreshToken } = generateTokens({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  setAuthCookies({
    res,
    accessToken,
    refreshToken: newRefreshToken,
  });

  res.status(OK).json({
    success: true,
    message: "Token refreshed successfully",
    accessToken,
  });
});
