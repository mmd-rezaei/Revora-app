import type { Car3DConfig } from "./types";

/** CC0 models in /public/models/cars/ (Khronos ToyCar, Buggy, CesiumMilkTruck). */
const BODY_TYPE_MODELS: Record<string, { path: string; scale: number }> = {
  Sedan: { path: "/models/cars/sedan.glb", scale: 0.85 },
  Coupe: { path: "/models/cars/sedan.glb", scale: 0.9 },
  Convertible: { path: "/models/cars/sedan.glb", scale: 0.88 },
  Hatchback: { path: "/models/cars/sedan.glb", scale: 0.82 },
  Wagon: { path: "/models/cars/sedan.glb", scale: 0.86 },
  SUV: { path: "/models/cars/suv.glb", scale: 0.55 },
  Crossover: { path: "/models/cars/suv.glb", scale: 0.55 },
  Pickup: { path: "/models/cars/pickup.glb", scale: 1.2 },
  Truck: { path: "/models/cars/pickup.glb", scale: 1.2 },
  Van: { path: "/models/cars/pickup.glb", scale: 1.1 },
  Micro: { path: "/models/cars/sedan.glb", scale: 0.7 },
  Classic: { path: "/models/cars/sedan.glb", scale: 0.8 },
};

const DEFAULT_MODEL = { path: "/models/cars/sedan.glb", scale: 0.85 };

/** Per-car overrides when a dedicated GLB exists. */
const CAR_3D_REGISTRY: Record<string, Omit<Car3DConfig, "carId">> = {};

export function resolveModelForBodyType(bodyType?: string) {
  if (!bodyType) return DEFAULT_MODEL;
  return BODY_TYPE_MODELS[bodyType] || DEFAULT_MODEL;
}

export function getCar3DConfig(
  carId: string,
  slug?: string,
  bodyType?: string,
): Car3DConfig & { modelScale: number; isGenericModel: boolean } {
  const bySlug = slug ? CAR_3D_REGISTRY[slug] : undefined;
  const byId = CAR_3D_REGISTRY[carId];
  const entry = bySlug || byId;

  if (entry?.hasModel && entry.modelPath) {
    return {
      carId,
      slug,
      ...entry,
      hasModel: true,
      modelScale: entry.fallbackScale ?? 1,
      isGenericModel: false,
    };
  }

  const body = resolveModelForBodyType(bodyType);
  return {
    carId,
    slug,
    hasModel: true,
    modelPath: body.path,
    fallbackScale: body.scale,
    modelScale: body.scale,
    isGenericModel: true,
  };
}
