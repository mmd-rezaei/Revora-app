export type UserRole = "user" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type Car = {
  id: string;
  generationId: string;
  brandId: string;
  modelId: string;
  brandName: string;
  modelName: string;
  generationName: string;
  slug: string;
  trim: string;
  year: number;
  bodyType: string;
  engine: string;
  displacement: number;
  fuelType: string;
  transmission: string;
  driveType: string;
  horsepower: number;
  torque: number;
  zeroToHundred: number;
  topSpeed: number;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  images: string[];
  description: string;
  features: string[];
  specs: Record<string, string | number>;
  status: "pending" | "approved" | "rejected";
  submittedBy: string | null;
  submittedAt?: string;
  reviewNote?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  country: string;
  description: string;
  carCount?: number;
};

export type BrandDetail = {
  brand: Brand;
  models: { id: string; name: string; slug: string; cars: Car[] }[];
};

export type CarsResponse = {
  items: Car[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type TuningPart = {
  id: string;
  name: string;
  slug: string;
  category: string;
  tier: string;
  exclusiveGroup: string | null;
  description: string;
  effects: Record<string, number>;
  price: number;
};

export type BuildConfig = {
  exterior: Record<string, string>;
  wheels: Record<string, string>;
  interior: Record<string, string>;
};

export type Performance = {
  horsepower: number;
  torque: number;
  zeroToHundred: number;
  topSpeed: number;
  weight: number;
  handling: number;
  braking: number;
  reliability: number;
};

export type Scores = {
  performance: number;
  handling: number;
  braking: number;
  style: number;
  overall: number;
};

export type Build = {
  id: string;
  userId: string;
  carId: Car | string;
  name: string;
  installedParts: TuningPart[] | string[];
  config: BuildConfig;
  calculatedPerformance: Performance;
  scores: Scores;
  createdAt?: string;
  updatedAt?: string;
};

export type Favorite = {
  id: string;
  car: Car;
  createdAt?: string;
};
