export class AppError extends Error {
  constructor(message, status = 400, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err.name === "CastError") {
    res.status(400).json({ error: "Invalid identifier" });
    return;
  }

  if (err.code === 11000) {
    res.status(409).json({ error: "A record with this value already exists" });
    return;
  }

  const status = err.status || 500;
  const payload = {
    error: status >= 500 ? "Internal server error" : err.message,
  };

  if (err.details && status < 500) {
    payload.details = err.details;
  }

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json(payload);
}
