import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Brand } from "../models/Brand.js";
import { VehicleModel } from "../models/VehicleModel.js";
import { Generation } from "../models/Generation.js";
import { Car } from "../models/Car.js";
import { TuningPart } from "../models/TuningPart.js";
import { Build } from "../models/Build.js";
import { Favorite } from "../models/Favorite.js";
import { slugify } from "../utils/helpers.js";
import { catalog, tuningParts } from "./catalog.js";

export async function seedDatabase({ reset = false } = {}) {
  if (reset) {
    await Promise.all([
      User.deleteMany({}),
      Brand.deleteMany({}),
      VehicleModel.deleteMany({}),
      Generation.deleteMany({}),
      Car.deleteMany({}),
      TuningPart.deleteMany({}),
      Build.deleteMany({}),
      Favorite.deleteMany({}),
    ]);
  }

  const existingCars = await Car.countDocuments();
  if (existingCars > 0) return { skipped: true, carCount: existingCars };

  const passwordHash = await bcrypt.hash(env.SEED_PASSWORD, 12);

  await User.create([
    {
      email: env.SEED_ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      name: "REVORA Admin",
      role: "admin",
    },
    {
      email: env.SEED_USER_EMAIL.toLowerCase(),
      passwordHash,
      name: "Alex Driver",
      role: "user",
    },
  ]);

  let carCount = 0;

  for (const brandData of catalog) {
    const brand = await Brand.create({
      name: brandData.name,
      slug: slugify(brandData.name),
      country: brandData.country,
      description: brandData.description,
      isActive: true,
    });

    for (const modelData of brandData.models) {
      const model = await VehicleModel.create({
        brandId: brand._id,
        name: modelData.name,
        slug: slugify(modelData.name),
      });

      for (const genData of modelData.generations) {
        const generation = await Generation.create({
          modelId: model._id,
          name: genData.name,
          slug: slugify(genData.name),
          yearStart: genData.yearStart,
          yearEnd: genData.yearEnd || null,
        });

        for (const carData of genData.cars) {
          await Car.create({
            generationId: generation._id,
            brandId: brand._id,
            modelId: model._id,
            brandName: brand.name,
            modelName: model.name,
            generationName: generation.name,
            slug: slugify(brand.name, model.name, generation.name, carData.trim, String(carData.year)),
            ...carData,
            status: "approved",
            submittedAt: new Date(),
          });
          carCount += 1;
        }
      }
    }
  }

  await TuningPart.insertMany(tuningParts);
  console.log(`Seeded ${catalog.length} brands, ${carCount} cars, ${tuningParts.length} parts`);
  return { skipped: false, carCount };
}
