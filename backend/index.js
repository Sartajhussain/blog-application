import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.route.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./routes/contactRoutes.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ==============================
// CORS
// ==============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://blog-application-774e.onrender.com",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (NODE_ENV === "development") return callback(null, true);
    callback(null, true);
  },
  credentials: true,
}));

// ==============================
// Middlewares
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==============================
// Rate limit
// ==============================
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many requests, try again later",
  },
});

// ==============================
// API ROUTES
// ==============================
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/contact", contactLimiter, contactRoutes);

// ==============================
// FRONTEND SAFE SERVE (IMPORTANT FIX)
// ==============================

const distPath = path.join(__dirname, "../frontend/dist");

// 👉 sirf tab serve karo jab dist exist kare
if (NODE_ENV === "production" && fsExists(distPath)) {

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

} else {
  console.log("⚠️ Frontend not served (dev mode or dist missing)");
}

// ==============================
// helper check
// ==============================
import fs from "fs";
function fsExists(p) {
  return fs.existsSync(p);
}

// ==============================
// START SERVER
// ==============================
app.listen(PORT, async () => {
  await connectDb();
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Mode: ${NODE_ENV}`);
});