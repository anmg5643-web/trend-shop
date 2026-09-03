import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

async function resetAdmin() {
  try {
    await connectDB();

    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123456";

    const admin = await Admin.findOne({ username });

    if (admin) {
      admin.password = password;

      // save() سيشغل التشفير الموجود في Admin.js
      await admin.save();

      console.log(`✅ تم تغيير كلمة مرور الأدمن: ${username}`);
    } else {
      await Admin.create({
        username,
        password,
      });

      console.log(`✅ تم إنشاء أدمن جديد: ${username}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ خطأ:", err);
    process.exit(1);
  }
}

resetAdmin();