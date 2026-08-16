import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import Admin from "./models/Admin.js";

const sampleProducts = [
  {
    name: "سماعات لاسلكية برو",
    category: "electronics",
    categoryLabel: "إلكترونيات",
    price: 250,
    rating: 4.8,
    icon: "Headphones",
    badge: "الأكثر مبيعاً",
    stock: 40,
  },
  {
    name: "ساعة ذكية سلسلة X",
    category: "electronics",
    categoryLabel: "إلكترونيات",
    price: 620,
    rating: 4.7,
    icon: "Watch",
    badge: "جديد",
    stock: 25,
  },
  {
    name: "حقيبة جلد طبيعي",
    category: "fashion",
    categoryLabel: "أزياء",
    price: 180,
    rating: 4.6,
    icon: "ShoppingBag",
    stock: 30,
  },
  {
    name: "قميص قطني كلاسيك",
    category: "fashion",
    categoryLabel: "أزياء",
    price: 65,
    rating: 4.5,
    icon: "Shirt",
    stock: 60,
  },
  {
    name: "آلة قهوة إسبريسو",
    category: "home",
    categoryLabel: "المنزل",
    price: 340,
    rating: 4.9,
    icon: "Coffee",
    badge: "الأكثر مبيعاً",
    stock: 15,
  },
  {
    name: "طقم عناية بالبشرة",
    category: "beauty",
    categoryLabel: "الجمال",
    price: 145,
    rating: 4.6,
    icon: "Sparkles",
    badge: "جديد",
    stock: 50,
  },
  {
    name: "حذاء رياضي خفيف",
    category: "fashion",
    categoryLabel: "أزياء",
    price: 210,
    rating: 4.7,
    icon: "Footprints",
    stock: 35,
  },
  {
    name: "نظارة شمسية أنيقة",
    category: "fashion",
    categoryLabel: "أزياء",
    price: 95,
    rating: 4.4,
    icon: "Glasses",
    stock: 45,
  },
];

async function seed() {
  await connectDB();

  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log(`✅ تمت إضافة ${sampleProducts.length} منتج تجريبي`);

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

  const existingAdmin = await Admin.findOne({ username: adminUsername });
  if (!existingAdmin) {
    await Admin.create({ username: adminUsername, password: adminPassword });
    console.log(`✅ تم إنشاء حساب أدمن: ${adminUsername} / ${adminPassword}`);
  } else {
    console.log("ℹ️ حساب الأدمن موجود مسبقاً، لم يتم إنشاء حساب جديد");
  }

  await mongoose.connection.close();
  console.log("✅ اكتملت عملية التعبئة بنجاح");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ فشلت عملية التعبئة:", err);
  process.exit(1);
});
