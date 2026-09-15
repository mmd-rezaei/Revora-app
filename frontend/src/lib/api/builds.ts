import { api } from "./client";
import type { Build, BuildConfig, Favorite, Performance, Scores, TuningPart } from "@/types";

export const fetchTuningParts = () => api<TuningPart[]>("/tuning-parts");

export const previewPerformance = (body: {
  carId: string;
  installedParts: string[];
  config: BuildConfig;
}) => api<{ calculatedPerformance: Performance; scores: Scores }>("/builds/preview", {
  method: "POST",
  body: JSON.stringify(body),
});

export const fetchBuilds = () => api<Build[]>("/builds");

export const createBuild = (body: {
  carId: string;
  name: string;
  installedParts: string[];
  config: BuildConfig;
}) => api<Build>("/builds", { method: "POST", body: JSON.stringify(body) });

export const deleteBuild = (id: string) =>
  api<{ ok: boolean }>(`/builds/${id}`, { method: "DELETE" });

export const fetchFavorites = () => api<Favorite[]>("/favorites");

export const addFavorite = (carId: string) =>
  api<{ id: string }>("/favorites", { method: "POST", body: JSON.stringify({ carId }) });

export const removeFavorite = (id: string) =>
  api<{ ok: boolean }>(`/favorites/${id}`, { method: "DELETE" });
