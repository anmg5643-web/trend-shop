import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { storeProductImage } from "../controllers/imageController.js";

const router = Router();

// مسارات عامة
router.get("/", getProducts);
router.get("/admin/all", protectAdmin, getAllProductsAdmin);
router.get("/:id", getProductById);

// مسارات الأدمن فقط
router.post("/upload", protectAdmin, upload.single("image"), storeProductImage);
router.post("/", protectAdmin, createProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;