import { Router } from "express";
import multer from "multer";
import path from "path";
import { body, validationResult } from "express-validator";

import { SellRequest } from "../models/SellRequest.js";
import { sendMail } from "../services/mailer.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const sellRouter = Router();

function tryGetUserFromAuthHeader(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;

  const token = auth.slice("Bearer ".length);
  try {
    return verifyAccessToken(token);
  } catch (e) {
    return null;
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/sell"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeExt = ext && ext.length <= 10 ? ext : "";
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${safeExt}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 6 } });

sellRouter.post(
  "/",
  upload.array("photos", 6),
  body("contactName").isString().isLength({ min: 2 }),
  body("contactEmail").isEmail(),
  body("description").isString().isLength({ min: 10 }),
  body("estimatedPrice").optional().isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Validation error", details: errors.array() });

    const photos = (req.files || []).map((f) => `/uploads/sell/${f.filename}`);

    const user = tryGetUserFromAuthHeader(req);

    const sell = await SellRequest.create({
      userId: user?.sub,
      contactName: req.body.contactName,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      brand: req.body.brand,
      model: req.body.model,
      condition: req.body.condition,
      description: req.body.description,
      estimatedPrice: req.body.estimatedPrice ? Number(req.body.estimatedPrice) : undefined,
      photos,
      status: "new"
    });

    try {
      await sendMail({
        to: sell.contactEmail,
        subject: "Solicitud de venta recibida",
        text: `Recibimos tu solicitud. Te contactaremos pronto. ID: ${sell._id}`
      });
    } catch (e) {
      // ignore email errors
    }

    return res.status(201).json({ item: sell });
  }
);
