import { api, queryString } from "./client";
import type { Car, CarsResponse } from "@/types";

export type CarFilters = {
  search?: string;
  brand?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  minYear?: number;
  maxYear?: number;
  minHp?: number;
  maxHp?: number;
  sort?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export const fetchCars = (filters: CarFilters = {}) =>
  api<CarsResponse>(`/cars${queryString(filters)}`);

export const fetchCar = (idOrSlug: string) => api<Car>(`/cars/${idOrSlug}`);

export const submitCar = (body: Record<string, unknown>) =>
  api<Car>("/cars/submit", { method: "POST", body: JSON.stringify(body) });

export const fetchPendingCars = () => fetchCars({ status: "pending", limit: 48 });

export const approveCar = (id: string) =>
  api<Car>(`/cars/${id}/approve`, { method: "PATCH" });

export const rejectCar = (id: string, reason: string) =>
  api<Car>(`/cars/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) });
