import { ZodError } from "zod";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function badRequest(message: string, code = "bad_request") {
  return new ApiError(400, code, message);
}

export function unauthorized(message = "Missing or invalid auth") {
  return new ApiError(401, "unauthorized", message);
}

export function forbidden(message = "Insufficient permissions") {
  return new ApiError(403, "forbidden", message);
}

export function notFound(message = "Resource not found") {
  return new ApiError(404, "not_found", message);
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof ZodError) {
    return badRequest("Invalid request data");
  }

  return new ApiError(500, "internal_error", "Internal server error");
}
