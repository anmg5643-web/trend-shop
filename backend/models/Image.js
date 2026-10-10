import mongoose from "mongoose";

// الصورة المصغّرة (WebP) تتخزن مباشرة في MongoDB
const imageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, default: "image/webp" },
  },
  { timestamps: true },
);

export default mongoose.model("Image", imageSchema);