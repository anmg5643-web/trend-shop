import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم المنتج مطلوب"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "الفئة مطلوبة"],
      enum: ["electronics", "fashion", "home", "beauty", "sports", "other"],
    },
    categoryLabel: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "السعر مطلوب"],
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    icon: {
      type: String,
      default: "ShoppingBag", // اسم أيقونة من مكتبة lucide-react
    },
    image: {
      type: String, // رابط صورة اختياري
      default: "",
    },
    badge: {
      type: String, // مثال: "جديد" أو "الأكثر مبيعاً"
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
