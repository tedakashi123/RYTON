import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
    subject: { type: String, trim: true },
    message: { type: String, trim: true, required: true },
    status: { type: String, enum: ["new", "read", "archived"], default: "new", index: true }
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
