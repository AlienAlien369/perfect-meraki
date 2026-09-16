const logger = require("../config/logger");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Wraps an async route handler so rejected promises reach the error middleware
// instead of needing a try/catch in every controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate value for a unique field";
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  logger.error(
    { err, statusCode, path: req.originalUrl, method: req.method, reqId: req.id },
    message
  );

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { AppError, asyncHandler, notFound, errorHandler };
