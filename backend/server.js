import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// خلف بروكسي مثل Render
app.set("trust proxy", 1);

// حماية HTTP
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ==========================================
// CORS
// ==========================================

// السماح بالرابط الموجود في FRONTEND_URL
// و localhost أثناء التطوير
const allowedOrigins = (
  process.env.FRONTEND_URL ||
  "https://trend-shop-anas-projects-fb5ad8f.vercel.app,http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""));

console.log("✅ Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // السماح للطلبات التي ليس لها Origin
      // مثل Postman أو بعض فحوصات Render
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// ==========================================
// Middlewares
// ==========================================

app.use(express.json());

app.use(morgan("dev"));

// ==========================================
// Rate Limiter
// ==========================================

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,

    message: {
      message: "طلبات كثيرة جداً، حاول مرة أخرى بعد قليل",
    },

    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ==========================================
// Login Rate Limiter
// ==========================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  message: {
    message:
      "محاولات دخول كثيرة جداً، حاول مرة أخرى بعد 15 دقيقة",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", loginLimiter);

// ==========================================
// Static uploads
// ==========================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==========================================
// Health Check
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "trend-shop-backend",
  });
});

// ==========================================
// API Routes
// ==========================================

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/auth", authRoutes);

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: "المسار غير موجود",
  });
});

// ==========================================
// Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  if (err.message?.includes("CORS blocked")) {
    return res.status(403).json({
      message: "CORS غير مسموح لهذا الموقع",
    });
  }

  res.status(500).json({
    message: "حدث خطأ في الخادم",
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ فشل الاتصال بقاعدة البيانات:");
    console.error(error);
    process.exit(1);
  });