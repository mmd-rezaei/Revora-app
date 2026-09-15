import mongoose from "mongoose";

const CATEGORIES = [
  "ecu",
  "intake",
  "exhaust",
  "downpipe",
  "intercooler",
  "turbo",
  "supercharger",
  "suspension",
  "brakes",
  "wheels",
  "tires",
  "drivetrain",
  "cooling",
];

const effectsSchema = new mongoose.Schema(
  {
    horsepower: { type: Number, default: 0 },
    torque: { type: Number, default: 0 },
    zeroToHundred: { type: Number, default: 0 },
    topSpeed: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    handling: { type: Number, default: 0 },
    braking: { type: Number, default: 0 },
    reliability: { type: Number, default: 0 },
    style: { type: Number, default: 0 },
  },
  { _id: false },
);

const tuningPartSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    tier: { type: String, default: "street", maxlength: 40 },
    exclusiveGroup: { type: String, default: null },
    description: { type: String, default: "", maxlength: 500 },
    effects: { type: effectsSchema, default: () => ({}) },
    price: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const TUNING_CATEGORIES = CATEGORIES;
export const TuningPart = mongoose.model("TuningPart", tuningPartSchema);
