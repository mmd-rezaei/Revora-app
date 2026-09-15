import { api } from "./client";
import type { User } from "@/types";

export const register = (body: { email: string; password: string; name: string }) =>
  api<{ user: User }>("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const login = (body: { email: string; password: string }) =>
  api<{ user: User }>("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const logout = () => api<{ ok: boolean }>("/auth/logout", { method: "POST" });

export const fetchMe = () => api<{ user: User }>("/auth/me");
