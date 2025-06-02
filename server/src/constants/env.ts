import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

/**
 * Safely gets an environment variable or throws if missing
 * @param key - Environment variable name
 * @param defaultValue - Fallback value if variable not set
 * @throws {Error} When variable is required but missing
 * @returns The environment variable value
 */
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  // Throw error for missing required variables (when no default provided)
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
};

// Server configuration
export const PORT = getEnv("PORT", "3000"); // Default to 3000 if not specified

// CORS origin for frontend requests
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");

export const JWT_SECRET = getEnv("JWT_SECRET");

export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const CLOUDINARY_CLOUD_KEY = getEnv("CLOUDINARY_CLOUD_KEY");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");
