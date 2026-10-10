import mongoose from "mongoose";
import sharp from "sharp";
import Image from "../models/Image.js";

// POST /api/products/upload  (أدمن فقط)
export async function storeProductImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "لم يتم اختيار صورة" });
  }

  let buffer;
  try {
    buffer = await sharp(req.file.buffer, { animated: false })
      .rotate()
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    return res.status(400).json({ message: "الملف ليس صورة صالحة" });
  }

  const image = await Image.create({ data: buffer, contentType: "image/webp" });

  res.status(201).json({ imageUrl: `/api/images/${image._id}` });
}

// GET /api/images/:id  (عام)
export async function getImage(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: "الصورة غير موجودة" });
  }

  const image = await Image.findById(id).select("data contentType");
  if (!image) {
    return res.status(404).json({ message: "الصورة غير موجودة" });
  }

  res.set("Content-Type", image.contentType);
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  res.send(image.data);
}