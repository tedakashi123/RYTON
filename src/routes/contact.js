import { Router } from "express";
import { body, validationResult } from "express-validator";

import { ContactMessage } from "../models/ContactMessage.js";
import { sendMail } from "../services/mailer.js";

export const contactRouter = Router();

contactRouter.post(
  "/",
  body("name").isString().isLength({ min: 2 }),
  body("email").isEmail(),
  body("message").isString().isLength({ min: 10 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Validation error", details: errors.array() });

    const msg = await ContactMessage.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      status: "new"
    });

    try {
      if (process.env.SMTP_USER) {
        await sendMail({
          to: process.env.SMTP_USER,
          subject: `Nuevo mensaje de contacto: ${msg.subject || "(sin asunto)"}`,
          text: `De: ${msg.name} <${msg.email}>\n\n${msg.message}`
        });
      }
    } catch (e) {
      // ignore email errors
    }

    return res.status(201).json({ ok: true });
  }
);
