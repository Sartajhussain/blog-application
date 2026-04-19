import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./database/db.js";

import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.route.js";
import contactRoutes from "./routes/contactRoutes.js";

import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// fix __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

/* =========================
   Middlewares
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   API ROUTES
========================= */
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/contact", contactRoutes);

/* =========================
   FRONTEND (ONLY PRODUCTION)
========================= */

const distPath = path.join(__dirname, "../frontend/dist");

if (NODE_ENV === "production") {
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

/* =========================
   START SERVER
========================= */
app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log("✅ Server running on port", PORT);
    console.log("🌍 Mode:", NODE_ENV);
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
  }
});