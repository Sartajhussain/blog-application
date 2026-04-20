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
import rateLimit from "express-rate-limit";
import fs from "fs";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

/* =========================
   IMPORTANT: TRUST PROXY (Render FIX)
========================= */
app.set("trust proxy", 1);

/* =========================
   CORS (FIXED - IMPORTANT)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://blog-application-774e.onrender.com", // frontend live URL (agar same ho)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked CORS origin:", origin);
      return callback(null, true); // safe allow (you can tighten later)
    },
    credentials: true,
  })
);

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   DEBUG (TEMP - REMOVE LATER)
========================= */
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

/* =========================
   RATE LIMIT (contact)
========================= */
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many requests, try again later",
  },
});

/* =========================
   API ROUTES
========================= */
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/contact", contactLimiter, contactRoutes);

/* =========================
   FRONTEND SERVE (SAFE)
========================= */
const distPath = path.join(__dirname, "../frontend/dist");
const indexPath = path.join(distPath, "index.html");

const isProduction = NODE_ENV === "production";

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

/* SPA fallback */
app.get(/.*/, (req, res) => {
  if (isProduction && fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(404).json({
    success: false,
    message: "Frontend not built or not found",
  });
});

/* =========================
   DB + SERVER START
========================= */
app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌍 Mode: ${NODE_ENV}`);
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
  }
});