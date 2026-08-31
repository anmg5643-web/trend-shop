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

// خلف بروكسي (مثل Render/Railway) لضمان قراءة صحيحة لعنوان IP الحقيقي
app.set("trust proxy", 1);

// حماية أساسية لرؤوس HTTP
// crossOriginResourcePolicy: "cross-origin" ضروري حتى يقدر الفرونت إند
// (على نطاق/منفذ مختلف) يعرض صور المنتجات المرفوعة من /uploads
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// السماح فقط لنطاق الفرونت إند المحدد في .env (يدعم أكثر من نطاق مفصول بفاصلة)
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: [
      "https://trend-shop-nas-projects-fbafdf.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());
app.use(morgan("dev"));

// حد عام لعدد الطلبات لكل IP (يحمي من إساءة الاستخدام والهجمات الآلية)
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    limit: 300,
    message: { message: "طلبات كثيرة جداً، حاول مرة أخرى بعد قليل" },
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// حد أشد صرامة على تسجيل دخول الأدمن (حماية من محاولات التخمين المتكررة)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "محاولات دخول كثيرة جداً، حاول مرة أخرى بعد 15 دقيقة" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth/login", loginLimiter);

// تقديم الصور المرفوعة كملفات ثابتة
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "alwaha-backend" });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// معالجة المسارات غير الموجودة
app.use((req, res) => {
  res.status(404).json({ message: "المسار غير موجود" });
});

// معالج أخطاء عام
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "حدث خطأ في الخادم" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
  });
});
