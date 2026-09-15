export class ApiError extends Error {
  status: number;
  payload: { error?: string; details?: unknown };

  constructor(status: number, payload: { error?: string; details?: unknown }) {
    super(payload.error || "Request failed");
    this.status = status;
    this.payload = payload;
  }
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (res.status === 204) return undefined as T;

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }
  return payload as T;
}

export function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
