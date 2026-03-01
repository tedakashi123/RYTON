import { Router } from "express";
import { body, validationResult } from "express-validator";

import { User } from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/passwords.js";
import { signAccessToken } from "../utils/jwt.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  body("name").isString().isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Validation error", details: errors.array() });

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await hashPassword(password);

    const user = await User.create({ name, email, passwordHash, role: "user" });

    const token = signAccessToken({ sub: String(user._id), role: user.role, email: user.email, name: user.name });

    return res.status(201).json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
      token
    });
  }
);

authRouter.post(
  "/login",
  body("email").isEmail(),
  body("password").isString().isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Validation error", details: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signAccessToken({ sub: String(user._id), role: user.role, email: user.email, name: user.name });

    return res.json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
      token
    });
  }
);
