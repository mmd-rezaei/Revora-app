import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, lowercase: true },
  },
  { timestamps: true },
);

modelSchema.index({ brandId: 1, slug: 1 }, { unique: true });

export const VehicleModel = mongoose.model("VehicleModel", modelSchema);
