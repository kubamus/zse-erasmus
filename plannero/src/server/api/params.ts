import { badRequest } from "./errors";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseUuidParam(value: string | undefined, paramName: string) {
  if (!value || !UUID_REGEX.test(value)) {
    throw badRequest(`Invalid ${paramName}`);
  }

  return value;
}

export function parseLimitParam(
  value: string | null,
  defaultValue: number,
  min: number,
  max: number,
) {
  if (!value) {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw badRequest("Invalid limit");
  }

  return parsed;
}
