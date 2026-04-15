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

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ✅ CORS Configuration - Allow production domain
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
    // Allow requests with no origin (mobile apps, same-origin requests)
    if (!origin) return callback(null, true);

    // Check if origin is in allowlist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, allow all origins
    if (NODE_ENV === "development") {
      return callback(null, true);
    }

    // In production, still allow for debugging - can be restricted later
    console.log("ℹ️ CORS request from:", origin);
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
}));

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);

// ✅ Serve Frontend (Static files)
const distPath = path.join(__dirname, "../frontend/dist");
console.log("📁 Looking for frontend dist at:", distPath);

app.use(express.static(distPath, (err) => {
  if (err) console.error("❌ Static serve error:", err);
}));

// ✅ SPA Fallback (React Router) - Must be AFTER all API routes
app.use((req, res) => {
  const indexPath = path.join(distPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("❌ Frontend dist not found at:", indexPath);
      res.status(500).send("Frontend not available");
    }
  });
});

// ✅ Start Server
app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`✅ Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
  }
});