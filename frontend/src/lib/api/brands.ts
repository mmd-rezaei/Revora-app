import { api } from "./client";
import type { Brand, BrandDetail } from "@/types";

export const fetchBrands = () => api<Brand[]>("/brands");
export const fetchBrand = (slug: string) => api<BrandDetail>(`/brands/${slug}`);
