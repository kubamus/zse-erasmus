import { ApiError, toApiError } from "./errors";

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function noContentResponse() {
  return new Response(null, { status: 204 });
}

export function errorResponse(error: unknown) {
  const apiError = toApiError(error);

  return Response.json(
    {
      code: apiError.code,
      message: apiError.message,
    },
    { status: apiError.status },
  );
}

export function assertNever(value: never): never {
  throw new ApiError(500, "internal_error", `Unhandled value: ${String(value)}`);
}
