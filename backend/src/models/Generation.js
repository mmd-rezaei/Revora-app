import mongoose from "mongoose";

const generationSchema = new mongoose.Schema(
  {
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: "VehicleModel", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, lowercase: true },
    yearStart: { type: Number, required: true, min: 1886, max: 2100 },
    yearEnd: { type: Number, default: null, min: 1886, max: 2100 },
  },
  { timestamps: true },
);

generationSchema.index({ modelId: 1, slug: 1 }, { unique: true });

export const Generation = mongoose.model("Generation", generationSchema);
