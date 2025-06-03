import { RequestHandler } from "express";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import appAssert from "../utils/appAssert";
import { verifyToken } from "../utils/tokens";

// wrap with catchErrors() if you need this to be async
const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  console.log("the access token got is ", accessToken);
  console.log("All cookies:", req.cookies);
  console.log("Cookie header:", req.headers.cookie);

  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);
  console.log("Token verification result:", { error, payload });

  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  (req as unknown as { userId: string }).userId = payload.userId;
  next();
};

export default authenticate;
