import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { validateOrderInput } from "../utils/validators.js";

// POST /api/orders (عام - من صفحة الدفع)
export async function createOrder(req, res) {
  try {
    const { items, customerName, phone, address, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "السلة فارغة" });
    }

    // تحقق صارم من صحة بيانات الزبون (اسم حقيقي، رقم ليبي صحيح، عنوان واضح)
    const errors = validateOrderInput({ customerName, phone, address });
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      return res.status(400).json({ message: firstError, errors });
    }

    // نتحقق من كل منتج ونحسب السعر من قاعدة البيانات (وليس من الفرونت إند) لأمان أكبر
    let totalPrice = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `منتج غير موجود: ${item.productId}` });
      }
      const quantity = Math.max(1, Number(item.quantity) || 1);
      totalPrice += product.price * quantity;
      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    const order = await Order.create({
      items: verifiedItems,
      customerName,
      phone,
      address,
      notes,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "تعذر إنشاء الطلب", error: err.message });
  }
}

// GET /api/orders (أدمن فقط)
export async function getOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب الطلبات", error: err.message });
  }
}

// PUT /api/orders/:id/status (أدمن فقط)
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "حالة غير صحيحة" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!order) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "تعذر تحديث الطلب", error: err.message });
  }
}
