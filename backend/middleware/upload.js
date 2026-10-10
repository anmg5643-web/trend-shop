import multer from "multer";

// الملف يبقى في الذاكرة فقط، لأن ديسك Render مؤقت
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("الصيغة غير مدعومة (فقط JPG, PNG, WEBP, GIF)"));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});