import { AppError } from "./errorHandler.js";

export function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!parsed.success) {
      next(new AppError("Invalid request", 400, parsed.error.flatten()));
      return;
    }

    req.validated = parsed.data;
    next();
  };
}
