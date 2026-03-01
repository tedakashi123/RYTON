import { Router } from "express";
import { body, validationResult } from "express-validator";

import { requireAuth } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { sendMail } from "../services/mailer.js";

export const ordersRouter = Router();

ordersRouter.post(
  "/",
  requireAuth,
  body("items").isArray({ min: 1 }),
  body("items.*.productId").isString(),
  body("items.*.quantity").isInt({ min: 1 }),
  body("shipping.fullName").optional().isString(),
  body("shipping.phone").optional().isString(),
  body("shipping.address").optional().isString(),
  body("shipping.city").optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Validation error", details: errors.array() });

    const userId = req.user.sub;

    const requestedItems = req.body.items;

    const products = await Product.find({ _id: { $in: requestedItems.map((i) => i.productId) }, isActive: true });
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const items = [];
    let subtotal = 0;

    for (const it of requestedItems) {
      const p = byId.get(String(it.productId));
      if (!p) return res.status(400).json({ error: `Invalid productId: ${it.productId}` });
      if (p.stock < Number(it.quantity)) return res.status(400).json({ error: `Not enough stock for: ${p.title}` });

      const unitPrice = Number(p.price);
      const quantity = Number(it.quantity);

      items.push({ productId: p._id, title: p.title, unitPrice, quantity });
      subtotal += unitPrice * quantity;
    }

    const total = subtotal;

    const order = await Order.create({
      userId,
      items,
      subtotal,
      total,
      status: "pending",
      shipping: req.body.shipping || {}
    });

    for (const it of items) {
      await Product.updateOne({ _id: it.productId }, { $inc: { stock: -it.quantity } });
    }

    try {
      const to = req.user.email;
      if (to) {
        await sendMail({
          to,
          subject: `Pedido recibido #${order._id}`,
          text: `Tu pedido fue recibido. Total: ${order.total}`
        });
      }
    } catch (e) {
      // ignore email errors
    }

    return res.status(201).json({ item: order });
  }
);

ordersRouter.get("/mine", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(100);
  return res.json({ items: orders });
});
