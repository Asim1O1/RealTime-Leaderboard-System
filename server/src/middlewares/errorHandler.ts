import { ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http";

/**
 * Global error handler middleware for Express applications
 * - Logs error details including request path and stack trace
 * - Returns consistent JSON error response format
 * - Should be the last middleware in the chain
 */
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Log error details for debugging
  console.log(`PATH: ${req.path}`, error);
  console.error(error.stack);

  // Send standardized error response
  res.status(INTERNAL_SERVER_ERROR).json({
    status: "error", // Consistent error indicator
    message: error.message, // User-friendly error message
  });
};

export default errorHandler;
