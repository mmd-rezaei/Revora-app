import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", default: null },
    buildId: { type: mongoose.Schema.Types.ObjectId, ref: "Build", default: null },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, carId: 1 }, { unique: true, sparse: true });
favoriteSchema.index({ userId: 1, buildId: 1 }, { unique: true, sparse: true });

export const Favorite = mongoose.model("Favorite", favoriteSchema);
