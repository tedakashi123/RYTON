import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    unitPrice: { type: Number, min: 0, required: true },
    quantity: { type: Number, min: 1, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, min: 0, required: true },
    total: { type: Number, min: 0, required: true },
    status: { type: String, enum: ["pending", "paid", "cancelled", "fulfilled"], default: "pending", index: true },
    shipping: {
      fullName: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
