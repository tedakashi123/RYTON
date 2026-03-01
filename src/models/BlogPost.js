import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true, index: true },
    slug: { type: String, trim: true, required: true, unique: true, index: true },
    excerpt: { type: String, trim: true },
    contentHtml: { type: String, required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    isPublished: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model("BlogPost", blogPostSchema);
