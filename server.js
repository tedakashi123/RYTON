import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import { connectMongo } from "./src/db/mongo.js";
import { apiRouter } from "./src/routes/index.js";
import { notFoundHandler, errorHandler } from "./src/middleware/errors.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });
fs.mkdirSync(path.join(__dirname, "uploads", "sell"), { recursive: true });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static('.'));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

await connectMongo();

// Find available port if 3000 is taken
async function findAvailablePort(startPort = 3000) {
  const net = await import('net');
  return new Promise((resolve) => {
    const server = net.default.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      // Port is taken, try next
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Start server with auto-port
async function startServer() {
  let port = PORT;
  if (PORT === 3000) {
    try {
      port = await findAvailablePort();
    } catch (e) {
      console.log('Using default port 3000');
    }
  }
  
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    if (port !== 3000) {
      console.log(`Note: Port 3000 was busy, using port ${port}`);
    }
  });
}

startServer();
