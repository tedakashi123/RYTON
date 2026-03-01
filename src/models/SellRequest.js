import mongoose from "mongoose";

const sellRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true },
    contactName: { type: String, trim: true, required: true },
    contactEmail: { type: String, trim: true, lowercase: true, required: true },
    contactPhone: { type: String, trim: true },
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    condition: { type: String, enum: ["nuevo", "reacondicionado", "usado"], default: "usado" },
    description: { type: String, trim: true, required: true },
    estimatedPrice: { type: Number, min: 0 },
    photos: [{ type: String }],
    status: { type: String, enum: ["new", "reviewing", "accepted", "rejected"], default: "new", index: true }
  },
  { timestamps: true }
);

export const SellRequest = mongoose.model("SellRequest", sellRequestSchema);
