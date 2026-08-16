import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI غير موجود في ملف .env");
    }
    await mongoose.connect(uri);
    console.log("✅ تم الاتصال بقاعدة البيانات MongoDB بنجاح");
  } catch (err) {
    console.error("❌ فشل الاتصال بقاعدة البيانات:", err.message);
    process.exit(1);
  }
}
