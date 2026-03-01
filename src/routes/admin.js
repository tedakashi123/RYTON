import { Router } from "express";

import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { SellRequest } from "../models/SellRequest.js";
import { ContactMessage } from "../models/ContactMessage.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/dashboard", async (req, res) => {
  const [products, orders, sellRequests, contacts] = await Promise.all([
    Product.countDocuments({}),
    Order.countDocuments({}),
    SellRequest.countDocuments({}),
    ContactMessage.countDocuments({})
  ]);

  return res.json({ stats: { products, orders, sellRequests, contacts } });
});

adminRouter.get("/orders", async (req, res) => {
  const items = await Order.find({}).sort({ createdAt: -1 }).limit(200);
  return res.json({ items });
});

adminRouter.get("/sell-requests", async (req, res) => {
  const items = await SellRequest.find({}).sort({ createdAt: -1 }).limit(200);
  return res.json({ items });
});

adminRouter.get("/contacts", async (req, res) => {
  const items = await ContactMessage.find({}).sort({ createdAt: -1 }).limit(200);
  return res.json({ items });
});
