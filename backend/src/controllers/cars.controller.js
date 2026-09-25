import { Brand } from "../models/Brand.js";
import { VehicleModel } from "../models/VehicleModel.js";
import { Generation } from "../models/Generation.js";
import { Car } from "../models/Car.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { escapeRegex, isObjectId, slugify } from "../utils/helpers.js";
import { serializeBrand, serializeCar } from "../utils/serialize.js";

const SORTS = {
  horsepower: { horsepower: -1 },
  zeroToHundred: { zeroToHundred: 1 },
  topSpeed: { topSpeed: -1 },
  newest: { createdAt: -1 },
  name: { brandName: 1, modelName: 1, trim: 1 },
};

async function resolveHierarchy({ brand, model, generation, year }) {
  const brandSlug = slugify(brand);
  let brandDoc = await Brand.findOne({ slug: brandSlug });
  if (!brandDoc) {
    brandDoc = await Brand.create({
      name: brand,
      slug: brandSlug,
      country: "Unknown",
      description: `${brand} vehicles on REVORA.`,
    });
  }

  const modelSlug = slugify(model);
  let modelDoc = await VehicleModel.findOne({ brandId: brandDoc._id, slug: modelSlug });
  if (!modelDoc) {
    modelDoc = await VehicleModel.create({
      brandId: brandDoc._id,
      name: model,
      slug: modelSlug,
    });
  }

  const generationSlug = slugify(generation);
  let generationDoc = await Generation.findOne({ modelId: modelDoc._id, slug: generationSlug });
  if (!generationDoc) {
    generationDoc = await Generation.create({
      modelId: modelDoc._id,
      name: generation,
      slug: generationSlug,
      yearStart: year,
      yearEnd: null,
    });
  }

  return { brandDoc, modelDoc, generationDoc };
}

function carPayload(body, brandDoc, modelDoc, generationDoc, userId, status) {
  return {
    generationId: generationDoc._id,
    brandId: brandDoc._id,
    modelId: modelDoc._id,
    brandName: brandDoc.name,
    modelName: modelDoc.name,
    generationName: generationDoc.name,
    slug: slugify(body.brand, body.model, body.generation, body.trim, String(body.year)),
    trim: body.trim,
    year: body.year,
    bodyType: body.bodyType,
    engine: body.engine,
    displacement: body.displacement,
    fuelType: body.fuelType,
    transmission: body.transmission,
    driveType: body.driveType,
    horsepower: body.horsepower,
    torque: body.torque,
    zeroToHundred: body.zeroToHundred,
    topSpeed: body.topSpeed,
    weight: body.weight,
    dimensions: body.dimensions || {},
    images: body.images || [],
    description: body.description || "",
    features: body.features || [],
    specs: body.specs || {},
    status,
    submittedBy: userId,
    submittedAt: new Date(),
  };
}

export const suggestCars = asyncHandler(async (req, res) => {
  const { q, limit } = req.validated.query;

  if (q.length < 2) {
    return res.json({ suggestions: [] });
  }

  const safe = escapeRegex(q);
  const regex = { $regex: safe, $options: "i" };
  const carFilter = { status: "approved" };

  const [brands, modelGroups, cars] = await Promise.all([
    Brand.find({ isActive: true, name: regex }).sort({ name: 1 }).limit(5).lean(),
    Car.aggregate([
      { $match: { ...carFilter, modelName: regex } },
      {
        $group: {
          _id: { brandName: "$brandName", modelName: "$modelName" },
          count: { $sum: 1 },
          image: { $first: { $arrayElemAt: ["$images", 0] } },
        },
      },
      { $sort: { "_id.brandName": 1, "_id.modelName": 1 } },
      { $limit: 5 },
    ]),
    Car.find({
      ...carFilter,
      $or: [{ brandName: regex }, { modelName: regex }, { trim: regex }, { generationName: regex }],
    })
      .select("slug brandName modelName trim year images")
      .sort({ brandName: 1, modelName: 1, year: -1 })
      .limit(limit)
      .lean(),
  ]);

  /** @type {Array<{ type: string, label: string, sublabel?: string, slug?: string, searchValue: string, image?: string }>} */
  const suggestions = [];
  const seen = new Set();

  for (const brand of brands) {
    const key = `brand:${brand.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push({
      type: "brand",
      label: brand.name,
      sublabel: brand.country,
      searchValue: brand.name,
    });
  }

  for (const group of modelGroups) {
    const label = `${group._id.brandName} ${group._id.modelName}`;
    const key = `model:${label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push({
      type: "model",
      label,
      sublabel: `${group.count} trims`,
      searchValue: group._id.modelName,
      image: group.image || undefined,
    });
  }

  for (const car of cars) {
    const label = `${car.brandName} ${car.modelName} ${car.trim}`;
    const key = `car:${car.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push({
      type: "car",
      label,
      sublabel: String(car.year),
      slug: car.slug,
      searchValue: `${car.brandName} ${car.modelName}`,
      image: car.images?.[0] || undefined,
    });
  }

  res.json({ suggestions: suggestions.slice(0, limit) });
});

export const listCars = asyncHandler(async (req, res) => {
  const query = req.validated.query;
  const filter = {};

  if (req.user?.role === "admin" && query.status) {
    filter.status = query.status;
  } else {
    filter.status = "approved";
  }

  if (query.brand) filter.brandName = query.brand;
  if (query.bodyType) filter.bodyType = query.bodyType;
  if (query.fuelType) filter.fuelType = query.fuelType;
  if (query.transmission) filter.transmission = query.transmission;
  if (query.driveType) filter.driveType = query.driveType;
  if (query.minYear || query.maxYear) {
    filter.year = {};
    if (query.minYear) filter.year.$gte = query.minYear;
    if (query.maxYear) filter.year.$lte = query.maxYear;
  }
  if (query.minHp || query.maxHp) {
    filter.horsepower = {};
    if (query.minHp) filter.horsepower.$gte = query.minHp;
    if (query.maxHp) filter.horsepower.$lte = query.maxHp;
  }
  if (query.search) {
    const safe = escapeRegex(query.search);
    filter.$or = [
      { brandName: { $regex: safe, $options: "i" } },
      { modelName: { $regex: safe, $options: "i" } },
      { trim: { $regex: safe, $options: "i" } },
      { generationName: { $regex: safe, $options: "i" } },
    ];
  }

  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const sort = SORTS[query.sort || "newest"];

  const [items, total] = await Promise.all([
    Car.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Car.countDocuments(filter),
  ]);

  res.json({
    items: items.map(serializeCar),
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 0,
  });
});

export const getCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const car = isObjectId(id)
    ? await Car.findById(id).lean()
    : await Car.findOne({ slug: id }).lean();

  if (!car) throw new AppError("Car not found", 404);

  const isOwner = req.user && String(car.submittedBy) === String(req.user._id);
  const isAdmin = req.user?.role === "admin";
  if (car.status !== "approved" && !isOwner && !isAdmin) {
    throw new AppError("Car not found", 404);
  }

  res.json(serializeCar(car));
});

export const submitCar = asyncHandler(async (req, res) => {
  const body = req.validated.body;
  const { brandDoc, modelDoc, generationDoc } = await resolveHierarchy(body);
  const payload = carPayload(body, brandDoc, modelDoc, generationDoc, req.user._id, "pending");
  const existing = await Car.findOne({ slug: payload.slug });
  if (existing) throw new AppError("This vehicle already exists on REVORA", 409);
  const car = await Car.create(payload);
  res.status(201).json(serializeCar(car));
});

export const createCarAdmin = asyncHandler(async (req, res) => {
  const body = req.validated.body;
  const { brandDoc, modelDoc, generationDoc } = await resolveHierarchy(body);
  const payload = carPayload(body, brandDoc, modelDoc, generationDoc, req.user._id, "approved");
  const car = await Car.create(payload);
  res.status(201).json(serializeCar(car));
});

export const approveCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndUpdate(
    req.params.id,
    { status: "approved", reviewNote: "" },
    { new: true },
  );
  if (!car) throw new AppError("Car not found", 404);
  res.json(serializeCar(car));
});

export const rejectCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndUpdate(
    req.params.id,
    { status: "rejected", reviewNote: req.validated.body.reason },
    { new: true },
  );
  if (!car) throw new AppError("Car not found", 404);
  res.json(serializeCar(car));
});

export const updateCar = asyncHandler(async (req, res) => {
  const body = req.validated.body;
  const car = await Car.findById(req.params.id);
  if (!car) throw new AppError("Car not found", 404);
  Object.assign(car, {
    trim: body.trim,
    year: body.year,
    bodyType: body.bodyType,
    engine: body.engine,
    displacement: body.displacement,
    fuelType: body.fuelType,
    transmission: body.transmission,
    driveType: body.driveType,
    horsepower: body.horsepower,
    torque: body.torque,
    zeroToHundred: body.zeroToHundred,
    topSpeed: body.topSpeed,
    weight: body.weight,
    dimensions: body.dimensions || car.dimensions,
    images: body.images,
    description: body.description,
    features: body.features,
    specs: body.specs || car.specs,
  });
  await car.save();
  res.json(serializeCar(car));
});

export const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) throw new AppError("Car not found", 404);
  res.json({ ok: true });
});

export const listBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean();
  const counts = await Car.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: "$brandId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
  res.json(
    brands.map((brand) => ({
      ...serializeBrand(brand),
      carCount: countMap.get(String(brand._id)) || 0,
    })),
  );
});

export const getBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!brand) throw new AppError("Brand not found", 404);
  const models = await VehicleModel.find({ brandId: brand._id }).sort({ name: 1 }).lean();
  const cars = await Car.find({ brandId: brand._id, status: "approved" })
    .sort({ modelName: 1, year: -1 })
    .lean();

  res.json({
    brand: serializeBrand(brand),
    models: models.map((model) => ({
      id: String(model._id),
      name: model.name,
      slug: model.slug,
      cars: cars.filter((car) => String(car.modelId) === String(model._id)).map(serializeCar),
    })),
  });
});
