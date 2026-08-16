import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import {
  LogOut,
  Boxes,
  ListOrdered,
  Pencil,
  Trash2,
  PackagePlus,
  RefreshCw,
} from "lucide-react";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getFileUrl,
} from "../lib/api.js";
import { getProductIcon } from "../lib/icons.js";
import ProductFormModal from "../components/admin/ProductFormModal.jsx";

const statusLabels = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const statusOrder = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("alwaha_admin_token");

  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(undefined); // undefined = مغلق، null = إضافة، object = تعديل

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [p, o] = await Promise.all([
        getAdminProducts(token),
        getOrders(token),
      ]);
      setProducts(p);
      setOrders(o);
    } catch (err) {
      setError(err.message || "تعذر تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, [token, navigate, loadData]);

  const handleLogout = () => {
    localStorage.removeItem("alwaha_admin_token");
    localStorage.removeItem("alwaha_admin_username");
    navigate("/admin/login");
  };

  const handleSaveProduct = async (data) => {
    if (editingProduct && editingProduct._id) {
      await updateProduct(token, editingProduct._id, data);
    } else {
      await createProduct(token, data);
    }
    setEditingProduct(undefined);
    loadData();
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await deleteProduct(token, id);
    loadData();
  };

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(token, orderId, status);
    loadData();
  };

  return (
    <div className="min-h-screen bg-trend-sage">
      {/* الرأس */}
      <header className="border-b border-separator bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <img src="/logo-icon.png" alt="Trend Shop" className="h-9 w-auto" />
            <span className="text-lg font-extrabold text-trend-ink">
              لوحة تحكم Trend Shop
            </span>
          </div>
          <Button
            variant="tertiary"
            size="sm"
            className="rounded-full"
            onPress={handleLogout}
          >
            <LogOut size={16} />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* التبويبات */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={tab === "products" ? "primary" : "tertiary"}
              className={"rounded-full " + (tab === "products" ? "bg-accent" : "")}
              onPress={() => setTab("products")}
            >
              <Boxes size={16} />
              المنتجات ({products.length})
            </Button>
            <Button
              size="sm"
              variant={tab === "orders" ? "primary" : "tertiary"}
              className={"rounded-full " + (tab === "orders" ? "bg-accent" : "")}
              onPress={() => setTab("orders")}
            >
              <ListOrdered size={16} />
              الطلبات ({orders.length})
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="tertiary"
              className="rounded-full"
              onPress={loadData}
            >
              <RefreshCw size={16} />
              تحديث
            </Button>
            {tab === "products" && (
              <Button
                size="sm"
                variant="primary"
                className="rounded-full bg-accent"
                onPress={() => setEditingProduct(null)}
              >
                <PackagePlus size={16} />
                إضافة منتج
              </Button>
            )}
          </div>
        </div>

        {loading && <p className="mt-10 text-center text-trend-ink/50">جاري التحميل...</p>}
        {!loading && error && (
          <p className="mt-10 rounded-xl bg-red-50 p-4 text-center text-red-600">
            {error}
          </p>
        )}

        {/* جدول المنتجات */}
        {!loading && !error && tab === "products" && (
          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
            {products.length === 0 ? (
              <p className="p-10 text-center text-trend-ink/50">
                لا توجد منتجات بعد. أضف أول منتج!
              </p>
            ) : (
              <ul className="divide-y divide-separator">
                {products.map((p) => {
                  const Icon = getProductIcon(p.icon);
                  const imageUrl = getFileUrl(p.image);
                  return (
                    <li key={p._id} className="flex items-center gap-4 p-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={p.name}
                          className="size-11 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-trend-sage text-trend-pine">
                          <Icon size={20} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-trend-ink">{p.name}</p>
                        <p className="text-sm text-trend-ink/50">
                          {p.categoryLabel} · {p.price} د.ل · مخزون: {p.stock}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="rounded-full p-2 text-trend-ink/60 hover:bg-trend-sage"
                        aria-label="تعديل"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="rounded-full p-2 text-red-500 hover:bg-red-50"
                        aria-label="حذف"
                      >
                        <Trash2 size={17} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* جدول الطلبات */}
        {!loading && !error && tab === "orders" && (
          <div className="mt-6 space-y-4">
            {orders.length === 0 ? (
              <p className="rounded-2xl bg-white p-10 text-center text-trend-ink/50 shadow-sm">
                لا توجد طلبات بعد.
              </p>
            ) : (
              orders.map((o) => (
                <div key={o._id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-trend-ink">{o.customerName}</p>
                      <p className="text-sm text-trend-ink/50">
                        {o.phone} · {o.address}
                      </p>
                    </div>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="rounded-full border border-separator px-3 py-1.5 text-sm outline-none focus:border-accent"
                    >
                      {statusOrder.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ul className="mt-3 space-y-1 border-t border-separator/60 pt-3 text-sm text-trend-ink/70">
                    {o.items.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{item.price * item.quantity} د.ل</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-separator/60 pt-3 font-bold text-trend-ink">
                    <span>الإجمالي</span>
                    <span>{o.totalPrice} د.ل</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {editingProduct !== undefined && (
        <ProductFormModal
          product={editingProduct}
          token={token}
          onClose={() => setEditingProduct(undefined)}
          onSubmit={handleSaveProduct}
        />
      )}
    </div>
  );
}
