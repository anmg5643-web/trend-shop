import { Router } from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", createOrder); // عام - من صفحة الدفع
router.get("/", protectAdmin, getOrders); // أدمن فقط
router.put("/:id/status", protectAdmin, updateOrderStatus); // أدمن فقط

export default router;
