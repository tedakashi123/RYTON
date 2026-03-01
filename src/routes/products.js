import { Router } from "express";
import { body, query, validationResult } from "express-validator";

import { Product } from "../models/Product.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const productsRouter = Router();

productsRouter.get(
  "/",
  query("brand").optional().isString(),
  query("model").optional().isString(),
  query("condition").optional().isString(),
  query("minPrice").optional().isNumeric(),
  query("maxPrice").optional().isNumeric(),
  query("q").optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Validation error", details: errors.array() });

    const { brand, model, condition, minPrice, maxPrice, q } = req.query;

    const filter = { isActive: true };

    if (brand) filter.brand = String(brand);
    if (model) filter.model = String(model);
    if (condition) filter.condition = String(condition);

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (q) {
      const re = new RegExp(String(q), "i");
      filter.$or = [{ title: re }, { brand: re }, { model: re }, { description: re }];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.json({ items: products });
  }
);

productsRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) return res.status(404).json({ error: "Product not found" });
  return res.json({ item: product });
});

productsRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  body("title").isString().isLength({ min: 2 }),
  body("brand").isString().isLength({ min: 1 }),
  body("model").isString().isLength({ min: 1 }),
  body("price").isNumeric(),
  body("condition").optional().isString(),
  body("stock").optional().isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Validation error", details: errors.array() });

    const product = await Product.create({ ...req.body, isActive: true });
    return res.status(201).json({ item: product });
  }
);

productsRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json({ item: product });
  }
);

productsRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json({ ok: true });
  }
);
