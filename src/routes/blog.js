import { Router } from "express";
import { body, validationResult } from "express-validator";

import { BlogPost } from "../models/BlogPost.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const blogRouter = Router();

blogRouter.get("/", async (req, res) => {
  const items = await BlogPost.find({ isPublished: true }).sort({ createdAt: -1 }).limit(50);
  return res.json({ items });
});

blogRouter.get("/:slug", async (req, res) => {
  const item = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
  if (!item) return res.status(404).json({ error: "Post not found" });
  return res.json({ item });
});

blogRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  body("title").isString().isLength({ min: 3 }),
  body("slug").isString().isLength({ min: 3 }),
  body("contentHtml").isString().isLength({ min: 10 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Validation error", details: errors.array() });

    const item = await BlogPost.create({
      title: req.body.title,
      slug: req.body.slug,
      excerpt: req.body.excerpt,
      contentHtml: req.body.contentHtml,
      tags: req.body.tags || [],
      isPublished: req.body.isPublished ?? true
    });

    return res.status(201).json({ item });
  }
);
