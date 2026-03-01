import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env") });

import { connectMongo } from "../src/db/mongo.js";
import { User } from "../src/models/User.js";
import { hashPassword } from "../src/utils/passwords.js";

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME || "Admin";

  if (!email || !password) {
    const missing = [];
    if (!email) missing.push("ADMIN_SEED_EMAIL");
    if (!password) missing.push("ADMIN_SEED_PASSWORD");
    throw new Error(`Missing ${missing.join(", ")} in .env (file: ${path.join(projectRoot, ".env")})`);
  }

  await connectMongo();

  const passwordHash = await hashPassword(password);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { name, email: email.toLowerCase().trim(), passwordHash, role: "admin" },
    { new: true, upsert: true }
  );

  // eslint-disable-next-line no-console
  console.log("Admin user ready:", { id: String(user._id), email: user.email, role: user.role });

  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
