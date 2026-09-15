export function serializeCar(car) {
  const obj = car?.toObject ? car.toObject() : car;
  if (!obj) return null;
  return {
    id: String(obj._id),
    generationId: String(obj.generationId),
    brandId: String(obj.brandId),
    modelId: String(obj.modelId),
    brandName: obj.brandName,
    modelName: obj.modelName,
    generationName: obj.generationName,
    slug: obj.slug,
    trim: obj.trim,
    year: obj.year,
    bodyType: obj.bodyType,
    engine: obj.engine,
    displacement: obj.displacement,
    fuelType: obj.fuelType,
    transmission: obj.transmission,
    driveType: obj.driveType,
    horsepower: obj.horsepower,
    torque: obj.torque,
    zeroToHundred: obj.zeroToHundred,
    topSpeed: obj.topSpeed,
    weight: obj.weight,
    dimensions: obj.dimensions || { length: 0, width: 0, height: 0 },
    images: obj.images || [],
    description: obj.description || "",
    features: obj.features || [],
    specs: obj.specs || {},
    status: obj.status,
    submittedBy: obj.submittedBy ? String(obj.submittedBy) : null,
    submittedAt: obj.submittedAt,
    reviewNote: obj.reviewNote || "",
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

export function serializeBrand(brand) {
  const obj = brand?.toObject ? brand.toObject() : brand;
  return {
    id: String(obj._id),
    name: obj.name,
    slug: obj.slug,
    logo: obj.logo || "",
    country: obj.country,
    description: obj.description || "",
  };
}

export function serializePart(part) {
  const obj = part?.toObject ? part.toObject() : part;
  return {
    id: String(obj._id),
    name: obj.name,
    slug: obj.slug,
    category: obj.category,
    tier: obj.tier,
    exclusiveGroup: obj.exclusiveGroup,
    description: obj.description || "",
    effects: obj.effects || {},
    price: obj.price || 0,
  };
}

export function serializeBuild(build) {
  const obj = build?.toObject ? build.toObject() : build;
  return {
    id: String(obj._id),
    userId: String(obj.userId),
    carId: obj.carId?._id ? serializeCar(obj.carId) : String(obj.carId),
    name: obj.name,
    installedParts: (obj.installedParts || []).map((part) =>
      part?._id ? serializePart(part) : String(part),
    ),
    config: obj.config || { exterior: {}, wheels: {}, interior: {} },
    calculatedPerformance: obj.calculatedPerformance || {},
    scores: obj.scores || {},
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}
