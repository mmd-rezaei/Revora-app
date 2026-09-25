import { z } from "zod";
import { CAR_ENUMS } from "../models/Car.js";

const email = z.string().trim().email().max(254).transform((v) => v.toLowerCase());
const password = z.string().min(8).max(72);
const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid id");
const httpUrl = z
  .string()
  .url()
  .max(500)
  .refine((value) => /^https?:\/\//i.test(value), "Only http(s) image URLs are allowed");

export const registerSchema = z.object({
  body: z.object({
    email,
    password,
    name: z.string().trim().min(2).max(80),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password,
  }),
});

export const carsSuggestSchema = z.object({
  query: z.object({
    q: z.string().trim().min(1).max(80),
    limit: z.coerce.number().int().min(1).max(20).optional().default(10),
  }),
});

export const carsQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    brand: z.string().trim().max(80).optional(),
    bodyType: z.enum(CAR_ENUMS.BODY_TYPES).optional(),
    fuelType: z.enum(CAR_ENUMS.FUEL_TYPES).optional(),
    transmission: z.enum(CAR_ENUMS.TRANSMISSIONS).optional(),
    driveType: z.enum(CAR_ENUMS.DRIVE_TYPES).optional(),
    minYear: z.coerce.number().int().min(1886).max(2100).optional(),
    maxYear: z.coerce.number().int().min(1886).max(2100).optional(),
    minHp: z.coerce.number().int().min(1).max(2500).optional(),
    maxHp: z.coerce.number().int().min(1).max(2500).optional(),
    sort: z.enum(["horsepower", "zeroToHundred", "topSpeed", "newest", "name"]).optional(),
    status: z.enum(CAR_ENUMS.STATUSES).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(48).optional().default(12),
  }),
});

const carFields = {
  brand: z.string().trim().min(1).max(80),
  model: z.string().trim().min(1).max(80),
  generation: z.string().trim().min(1).max(80),
  year: z.coerce.number().int().min(1886).max(2100),
  trim: z.string().trim().min(1).max(80),
  bodyType: z.enum(CAR_ENUMS.BODY_TYPES),
  engine: z.string().trim().min(1).max(120),
  displacement: z.coerce.number().min(0).max(20),
  fuelType: z.enum(CAR_ENUMS.FUEL_TYPES),
  transmission: z.enum(CAR_ENUMS.TRANSMISSIONS),
  driveType: z.enum(CAR_ENUMS.DRIVE_TYPES),
  horsepower: z.coerce.number().int().min(1).max(2500),
  torque: z.coerce.number().int().min(1).max(3000),
  zeroToHundred: z.coerce.number().min(1.5).max(30),
  topSpeed: z.coerce.number().int().min(80).max(550),
  weight: z.coerce.number().int().min(400).max(4500),
  description: z.string().trim().max(4000).optional().default(""),
  features: z.array(z.string().trim().max(80)).max(24).optional().default([]),
  images: z.array(httpUrl).max(8).optional().default([]),
  dimensions: z
    .object({
      length: z.coerce.number().min(0).max(8000).optional(),
      width: z.coerce.number().min(0).max(3000).optional(),
      height: z.coerce.number().min(0).max(3000).optional(),
    })
    .optional(),
  specs: z.record(z.string().max(40), z.union([z.string().max(120), z.number()])).optional(),
};

export const submitCarSchema = z.object({
  body: z.object(carFields),
});

export const rejectCarSchema = z.object({
  body: z.object({
    reason: z.string().trim().min(3).max(500),
  }),
  params: z.object({ id: objectId }),
});

export const idParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const previewBuildSchema = z.object({
  body: z.object({
    carId: objectId,
    installedParts: z.array(objectId).max(20).optional().default([]),
    config: z
      .object({
        exterior: z.record(z.string().max(40), z.string().max(80)).optional(),
        wheels: z.record(z.string().max(40), z.string().max(80)).optional(),
        interior: z.record(z.string().max(40), z.string().max(80)).optional(),
      })
      .optional()
      .default({}),
  }),
});

export const saveBuildSchema = z.object({
  body: z.object({
    carId: objectId,
    name: z.string().trim().min(2).max(80),
    installedParts: z.array(objectId).max(20).optional().default([]),
    config: z
      .object({
        exterior: z.record(z.string().max(40), z.string().max(80)).optional(),
        wheels: z.record(z.string().max(40), z.string().max(80)).optional(),
        interior: z.record(z.string().max(40), z.string().max(80)).optional(),
      })
      .optional()
      .default({}),
  }),
});

export const updateBuildSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    installedParts: z.array(objectId).max(20).optional(),
    config: z
      .object({
        exterior: z.record(z.string().max(40), z.string().max(80)).optional(),
        wheels: z.record(z.string().max(40), z.string().max(80)).optional(),
        interior: z.record(z.string().max(40), z.string().max(80)).optional(),
      })
      .optional(),
  }),
});

export const favoriteSchema = z.object({
  body: z.object({
    carId: objectId.optional(),
    buildId: objectId.optional(),
  }).refine((value) => Boolean(value.carId || value.buildId), {
    message: "carId or buildId is required",
  }),
});
