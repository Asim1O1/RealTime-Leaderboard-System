import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/AppError";

const handleZodError = (res: Response, error: z.ZodError): void => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  res.status(BAD_REQUEST).json({
    success: false,
    message: "Validation failed",
    errors,
    statusCode: BAD_REQUEST,
  });
};

const handleAppError = (res: Response, error: AppError): void => {
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errorCode: error.errorCode,
    statusCode: error.statusCode,
  });
};

/**
 * Global error handler middleware
 * - Logs error details including request path and stack trace
 * - Returns consistent JSON error response format
 * - Should be the last middleware in the chain
 */
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Log error details for debugging
  console.log(`PATH: ${req.path}`, error);
  console.error(error.stack);

  if (error instanceof z.ZodError) {
    handleZodError(res, error);
    return;
  }

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  // Send standardized error response
  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
    statusCode: INTERNAL_SERVER_ERROR,
  });
};

export default errorHandler;
