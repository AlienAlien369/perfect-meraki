const { AppError } = require("./errorHandler");

// Validates req.body against a Zod schema; replaces req.body with the parsed
// (trimmed/coerced) result so controllers can trust its shape.
const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
      .join("; ");
    return next(new AppError(message, 400));
  }
  req.body = result.data;
  next();
};

module.exports = { validateBody };
