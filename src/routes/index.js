import { Router } from "express";

import { authRouter } from "./auth.js";
import { productsRouter } from "./products.js";
import { ordersRouter } from "./orders.js";
import { sellRouter } from "./sell.js";
import { blogRouter } from "./blog.js";
import { contactRouter } from "./contact.js";
import { adminRouter } from "./admin.js";

export const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.json({ name: "ryton-api" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/sell", sellRouter);
apiRouter.use("/blog", blogRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/admin", adminRouter);
