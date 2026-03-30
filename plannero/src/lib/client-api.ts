"use client";

export async function apiRequest<T = unknown>(path: string, init?: RequestInit) {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T) : null;

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
