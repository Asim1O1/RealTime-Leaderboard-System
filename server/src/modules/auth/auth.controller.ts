import { CONFLICT, CREATED } from "../../constants/http";
import { registerSchema } from "../../schemas/auth.schema";
import appAssert from "../../utils/appAssert";
import { hashValue } from "../../utils/bcrypt";
import catchErrors from "../../utils/catchErrors";
import { setAuthCookies } from "../../utils/cookies";
import prisma from "../../utils/prisma";
import generateTokens from "../../utils/tokens";

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse(req.body);

  const { email, username, password } = request;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  appAssert(
    !existingUser,
    CONFLICT,
    "User already exists with this email or username"
  );

  // Hash password
  const hashedPassword = await hashValue(password, 12);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  // Generate JWT tokens for immediate authentication
  const { accessToken, refreshToken } = generateTokens({
    userId: newUser.id,
    email: newUser.email,
    username: newUser.username,
  });

  // Set secure authentication cookies
  setAuthCookies({
    res,
    accessToken,
    refreshToken,
  });

  // Return success response (exclude password and tokens from response body)
  res.status(CREATED).json({
    success: true,
    message: "User registered and logged in successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      createdAt: newUser.createdAt,
    },
  });
});
