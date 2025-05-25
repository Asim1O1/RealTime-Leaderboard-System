import { CookieOptions, Response } from "express";

// Security configuration based on environment
const secure = process.env.NODE_ENV !== "development";

// Time constants for cookie expiration
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

// Configurable paths
const REFRESH_PATH = "/api/auth/refresh";

/**
 * Default cookie options for secure authentication
 * - httpOnly: Prevents XSS attacks by making cookies inaccessible to JavaScript
 * - secure: Ensures cookies are only sent over HTTPS in production
 * - sameSite: Prevents CSRF attacks by restricting cross-site requests
 */
const defaults: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite: "strict",
  maxAge: SEVEN_DAYS,
};

/**
 * Gets cookie options for access tokens
 * Access tokens have short lifespan for security
 * @returns CookieOptions configured for access tokens
 */
const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    maxAge: FIFTEEN_MINUTES,
  };
};

/**
 * Gets cookie options for refresh tokens
 * Refresh tokens have longer lifespan but are path-restricted
 * @returns CookieOptions configured for refresh tokens
 */
const getRefreshTokenCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    maxAge: THIRTY_DAYS,
    path: REFRESH_PATH, // Restrict to refresh endpoint only
  };
};

/**
 * Parameters for setting authentication cookies
 */
type SetAuthCookiesParams = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

/**
 * Sets both access and refresh token cookies with appropriate security settings
 * @param params - Object containing response object and tokens
 */
export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: SetAuthCookiesParams): void => {
  res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
  res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

/**
 * Clears authentication cookies for logout
 * Must match the path used when setting the refresh token cookie
 * @param res - Express response object
 */
export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: REFRESH_PATH });
};
