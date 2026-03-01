import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    brand: { type: String, trim: true, required: true, index: true },
    model: { type: String, trim: true, required: true, index: true },
    cpu: { type: String, trim: true },
    ramGb: { type: Number, min: 0 },
    storageGb: { type: Number, min: 0 },
    storageType: { type: String, enum: ["HDD", "SSD", "NVMe"], default: "SSD" },
    gpu: { type: String, trim: true },
    condition: { type: String, enum: ["nuevo", "reacondicionado", "usado"], default: "reacondicionado", index: true },
    price: { type: Number, min: 0, required: true, index: true },
    currency: { type: String, default: "COP" },
    stock: { type: Number, min: 0, default: 0 },
    description: { type: String, trim: true },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
