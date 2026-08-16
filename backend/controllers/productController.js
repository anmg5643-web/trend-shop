import Product from "../models/Product.js";

// POST /api/products/upload (أدمن فقط) - يرفع صورة ويرجع رابطها
export async function uploadProductImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "لم يتم إرفاق أي صورة" });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
}


// GET /api/products?category=xxx
export async function getProducts(req, res) {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };
    if (category && category !== "all") {
      filter.category = category;
    }
    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب المنتجات", error: err.message });
  }
}

// GET /api/products/:id
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب المنتج", error: err.message });
  }
}

// POST /api/products (أدمن فقط)
export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "بيانات غير صحيحة", error: err.message });
  }
}

// PUT /api/products/:id (أدمن فقط)
export async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "تعذر تحديث المنتج", error: err.message });
  }
}

// DELETE /api/products/:id (أدمن فقط)
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }
    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "تعذر حذف المنتج", error: err.message });
  }
}

// GET /api/products/admin/all (أدمن فقط - يشمل غير المفعّلة)
export async function getAllProductsAdmin(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب المنتجات", error: err.message });
  }
}
