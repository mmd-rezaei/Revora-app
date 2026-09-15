import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String, default: "" },
    country: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: "", maxlength: 2000 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Brand = mongoose.model("Brand", brandSchema);
