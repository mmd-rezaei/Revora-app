import mongoose from "mongoose";

const BODY_TYPES = ["Sedan", "Coupe", "Hatchback", "Wagon", "SUV", "Convertible", "Pickup", "Roadster"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"];
const TRANSMISSIONS = ["Manual", "Automatic", "DCT", "CVT", "Single-Speed"];
const DRIVE_TYPES = ["RWD", "FWD", "AWD", "4WD"];
const STATUSES = ["pending", "approved", "rejected"];

const carSchema = new mongoose.Schema(
  {
    generationId: { type: mongoose.Schema.Types.ObjectId, ref: "Generation", required: true, index: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true, index: true },
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: "VehicleModel", required: true, index: true },
    brandName: { type: String, required: true },
    modelName: { type: String, required: true },
    generationName: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    trim: { type: String, required: true, trim: true, maxlength: 80 },
    year: { type: Number, required: true, min: 1886, max: 2100, index: true },
    bodyType: { type: String, enum: BODY_TYPES, required: true },
    engine: { type: String, required: true, maxlength: 120 },
    displacement: { type: Number, default: 0, min: 0, max: 20 },
    fuelType: { type: String, enum: FUEL_TYPES, required: true },
    transmission: { type: String, enum: TRANSMISSIONS, required: true },
    driveType: { type: String, enum: DRIVE_TYPES, required: true },
    horsepower: { type: Number, required: true, min: 1, max: 2500 },
    torque: { type: Number, required: true, min: 1, max: 3000 },
    zeroToHundred: { type: Number, required: true, min: 1.5, max: 30 },
    topSpeed: { type: Number, required: true, min: 80, max: 550 },
    weight: { type: Number, required: true, min: 400, max: 4500 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    images: { type: [String], default: [] },
    description: { type: String, default: "", maxlength: 4000 },
    features: { type: [String], default: [] },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: STATUSES, default: "pending", index: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    submittedAt: { type: Date, default: Date.now },
    reviewNote: { type: String, default: "", maxlength: 500 },
  },
  { timestamps: true },
);

carSchema.index({ brandName: 1, modelName: 1 });
carSchema.index({ status: 1, createdAt: -1 });
carSchema.index({ horsepower: -1 });

export const CAR_ENUMS = { BODY_TYPES, FUEL_TYPES, TRANSMISSIONS, DRIVE_TYPES, STATUSES };
export const Car = mongoose.model("Car", carSchema);
