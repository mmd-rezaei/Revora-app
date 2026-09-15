import { TuningPart } from "../models/TuningPart.js";
import { Car } from "../models/Car.js";
import { Build } from "../models/Build.js";
import { Favorite } from "../models/Favorite.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { isObjectId } from "../utils/helpers.js";
import { serializeBuild, serializeCar } from "../utils/serialize.js";
import { calculatePerformance } from "../services/tuningEngine.js";

export const listParts = asyncHandler(async (req, res) => {
  const filter = {};
  if (typeof req.query.category === "string" && req.query.category.length <= 40) {
    filter.category = req.query.category;
  }
  const parts = await TuningPart.find(filter).sort({ category: 1, name: 1 }).lean();
  res.json(parts.map(serializePart));
});

async function resolveBuildInput(carId, partIds, config) {
  const car = await Car.findById(carId).lean();
  if (!car || car.status !== "approved") throw new AppError("Car not found", 404);

  const uniqueIds = [...new Set(partIds.map(String))];
  const parts = uniqueIds.length
    ? await TuningPart.find({ _id: { $in: uniqueIds } }).lean()
    : [];
  if (parts.length !== uniqueIds.length) {
    throw new AppError("One or more tuning parts are invalid", 400);
  }

  return { car, parts, result: calculatePerformance(car, parts, config) };
}

export const previewBuild = asyncHandler(async (req, res) => {
  const { carId, installedParts, config } = req.validated.body;
  const { result } = await resolveBuildInput(carId, installedParts, config);
  res.json(result);
});

export const createBuild = asyncHandler(async (req, res) => {
  const { carId, name, installedParts, config } = req.validated.body;
  const { result } = await resolveBuildInput(carId, installedParts, config);
  const build = await Build.create({
    userId: req.user._id,
    carId,
    name,
    installedParts,
    config,
    calculatedPerformance: result.calculatedPerformance,
    scores: result.scores,
  });
  const populated = await Build.findById(build._id)
    .populate("carId")
    .populate("installedParts")
    .lean();
  res.status(201).json(serializeBuild(populated));
});

export const listBuilds = asyncHandler(async (req, res) => {
  const builds = await Build.find({ userId: req.user._id })
    .populate("carId")
    .populate("installedParts")
    .sort({ updatedAt: -1 })
    .lean();
  res.json(builds.map(serializeBuild));
});

export const getBuild = asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id).populate("carId").populate("installedParts").lean();
  if (!build) throw new AppError("Build not found", 404);
  if (String(build.userId) !== String(req.user._id) && req.user.role !== "admin") {
    throw new AppError("Build not found", 404);
  }
  res.json(serializeBuild(build));
});

export const updateBuild = asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id);
  if (!build) throw new AppError("Build not found", 404);
  if (String(build.userId) !== String(req.user._id)) {
    throw new AppError("Build not found", 404);
  }

  const body = req.validated.body;
  if (body.name) build.name = body.name;
  if (body.config) build.config = body.config;
  if (body.installedParts) build.installedParts = body.installedParts;

  const { result } = await resolveBuildInput(
    String(build.carId),
    build.installedParts.map(String),
    build.config,
  );
  build.calculatedPerformance = result.calculatedPerformance;
  build.scores = result.scores;
  await build.save();

  const populated = await Build.findById(build._id)
    .populate("carId")
    .populate("installedParts")
    .lean();
  res.json(serializeBuild(populated));
});

export const deleteBuild = asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id);
  if (!build) throw new AppError("Build not found", 404);
  if (String(build.userId) !== String(req.user._id)) {
    throw new AppError("Build not found", 404);
  }
  await build.deleteOne();
  res.json({ ok: true });
});

export const listFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id }).populate("carId").lean();
  res.json(
    favorites
      .filter((item) => item.carId)
      .map((item) => ({
        id: String(item._id),
        car: serializeCar(item.carId),
        createdAt: item.createdAt,
      })),
  );
});

export const addFavorite = asyncHandler(async (req, res) => {
  const { carId, buildId } = req.validated.body;
  if (carId && !isObjectId(carId)) throw new AppError("Invalid car", 400);
  const favorite = await Favorite.findOneAndUpdate(
    { userId: req.user._id, carId: carId || null, buildId: buildId || null },
    { userId: req.user._id, carId: carId || null, buildId: buildId || null },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  res.status(201).json({ id: String(favorite._id) });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!favorite) {
    const byCar = await Favorite.findOneAndDelete({
      userId: req.user._id,
      carId: req.params.id,
    });
    if (!byCar) throw new AppError("Favorite not found", 404);
  }
  res.json({ ok: true });
});
