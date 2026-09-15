import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    exterior: { type: mongoose.Schema.Types.Mixed, default: {} },
    wheels: { type: mongoose.Schema.Types.Mixed, default: {} },
    interior: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

const performanceSchema = new mongoose.Schema(
  {
    horsepower: Number,
    torque: Number,
    zeroToHundred: Number,
    topSpeed: Number,
    weight: Number,
    handling: Number,
    braking: Number,
    reliability: Number,
  },
  { _id: false },
);

const scoresSchema = new mongoose.Schema(
  {
    performance: Number,
    handling: Number,
    braking: Number,
    style: Number,
    overall: Number,
  },
  { _id: false },
);

const buildSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    installedParts: [{ type: mongoose.Schema.Types.ObjectId, ref: "TuningPart" }],
    config: { type: configSchema, default: () => ({}) },
    calculatedPerformance: { type: performanceSchema, default: () => ({}) },
    scores: { type: scoresSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export const Build = mongoose.model("Build", buildSchema);
