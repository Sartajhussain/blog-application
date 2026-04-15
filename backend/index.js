import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.route.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 8000;

// ✅ CORS (PRODUCTION SAFE)
app.use(cors({
  origin: true,
  credentials: true,
}));

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);

// ✅ Serve Frontend (VERY IMPORTANT FIX)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ SPA Fallback (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
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