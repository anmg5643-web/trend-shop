import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@heroui/react";
import {
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useCart } from "../context/CartContext.jsx";
import { createOrder, getFileUrl } from "../lib/api.js";
import { getProductIcon } from "../lib/icons.js";
import { buildOrderWhatsAppLink } from "../lib/whatsapp.js";
import { validateOrderForm } from "../lib/validation.js";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const [step, setStep] = useState("cart"); // cart | checkout | success
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastOrder, setLastOrder] = useState(null);
  const [lastItems, setLastItems] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateOrderForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("في بيانات ناقصة أو غير صحيحة، راجع الحقول أدناه");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...form,
      });
      setLastOrder(order);
      setLastItems(items);
      clearCart();
      setStep("success");
    } catch (err) {
      setError(err.message || "تعذر إرسال الطلب، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    if (!lastOrder) return;
    const link = buildOrderWhatsAppLink({ order: lastOrder, items: lastItems, form });
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {step !== "success" && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-trend-ink/60 hover:text-accent"
          >
            <ArrowRight size={16} />
            متابعة التسوق
          </Link>
        )}

        <h1 className="mt-4 text-2xl font-black text-trend-ink sm:text-3xl">
          {step === "cart" && `سلة المشتريات (${items.length})`}
          {step === "checkout" && "إتمام الطلب"}
          {step === "success" && "تم استلام طلبك"}
        </h1>

        {/* ---------- خطوة السلة ---------- */}
        {step === "cart" && (
          <>
            {items.length === 0 ? (
              <div className="mt-16 flex flex-col items-center gap-3 text-center text-trend-ink/50">
                <ShoppingBag size={44} />
                <p>سلتك فارغة حالياً</p>
                <Button
                  variant="primary"
                  className="mt-2 rounded-full bg-accent"
                  onPress={() => navigate("/#products")}
                >
                  تصفّح المنتجات
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* قائمة المنتجات */}
                <ul className="space-y-3 lg:col-span-2">
                  {items.map((item) => {
                    const Icon = getProductIcon(item.icon);
                    const imageUrl = getFileUrl(item.image);
                    return (
                      <li
                        key={item.productId}
                        className="flex items-center gap-4 rounded-2xl border border-separator/60 p-4"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="size-16 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-trend-sage text-trend-pine">
                            <Icon size={28} strokeWidth={1.7} />
                          </span>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-trend-ink">{item.name}</p>
                          <p className="mt-1 text-sm text-trend-ink/50">
                            {item.price} د.ل × {item.quantity} ={" "}
                            <span className="font-semibold text-trend-ink">
                              {item.price * item.quantity} د.ل
                            </span>
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="flex size-8 items-center justify-center rounded-full bg-trend-sage text-trend-pine"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="w-7 text-center font-bold text-trend-ink">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="flex size-8 items-center justify-center rounded-full bg-trend-sage text-trend-pine"
                            >
                              <Plus size={15} />
                            </button>

                            <button
                              onClick={() => removeItem(item.productId)}
                              aria-label="حذف"
                              className="mr-auto text-trend-ink/40 hover:text-red-600"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* ملخص الطلب */}
                <div className="h-fit rounded-2xl bg-trend-sage p-6 lg:sticky lg:top-24">
                  <p className="mb-4 font-bold text-trend-ink">ملخص الطلب</p>
                  <div className="flex justify-between text-sm text-trend-ink/70">
                    <span>عدد القطع</span>
                    <span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-trend-sage-deep pt-3 text-lg font-black text-trend-ink">
                    <span>الإجمالي</span>
                    <span>{totalPrice} د.ل</span>
                  </div>
                  <Button
                    variant="primary"
                    fullWidth
                    className="mt-5 rounded-full bg-accent"
                    onPress={() => setStep("checkout")}
                  >
                    متابعة إتمام الطلب
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ---------- خطوة إتمام الطلب ---------- */}
        {step === "checkout" && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-4 lg:col-span-2"
            >
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                  الاسم الكامل
                </label>
                <input
                  value={form.customerName}
                  onChange={(e) => {
                    setForm({ ...form, customerName: e.target.value });
                    setFieldErrors({ ...fieldErrors, customerName: null });
                  }}
                  className={
                    "w-full rounded-xl border px-4 py-2.5 outline-none focus:border-accent " +
                    (fieldErrors.customerName ? "border-red-400" : "border-separator")
                  }
                  placeholder="مثال: محمد علي"
                />
                {fieldErrors.customerName && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.customerName}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                  رقم الهاتف
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    setFieldErrors({ ...fieldErrors, phone: null });
                  }}
                  className={
                    "w-full rounded-xl border px-4 py-2.5 outline-none focus:border-accent " +
                    (fieldErrors.phone ? "border-red-400" : "border-separator")
                  }
                  placeholder="0912345678"
                  dir="ltr"
                />
                {fieldErrors.phone && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.phone}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                  العنوان
                </label>
                <input
                  value={form.address}
                  onChange={(e) => {
                    setForm({ ...form, address: e.target.value });
                    setFieldErrors({ ...fieldErrors, address: null });
                  }}
                  className={
                    "w-full rounded-xl border px-4 py-2.5 outline-none focus:border-accent " +
                    (fieldErrors.address ? "border-red-400" : "border-separator")
                  }
                  placeholder="مثال: طرابلس، تاجوراء، بجانب مسجد..."
                />
                {fieldErrors.address && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.address}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
                />
              </div>
            </form>

            {/* ملخص مختصر */}
            <div className="h-fit rounded-2xl bg-trend-sage p-6 lg:sticky lg:top-24">
              <p className="mb-4 font-bold text-trend-ink">ملخص طلبك</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex justify-between text-sm text-trend-ink/70"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-trend-ink">
                      {item.price * item.quantity} د.ل
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-trend-sage-deep pt-3 text-lg font-black text-trend-ink">
                <span>الإجمالي</span>
                <span>{totalPrice} د.ل</span>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <Button
                  type="submit"
                  form="checkout-form"
                  variant="primary"
                  fullWidth
                  isDisabled={submitting}
                  className="rounded-full bg-accent"
                >
                  {submitting ? "جاري الإرسال..." : "تأكيد الطلب"}
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  fullWidth
                  className="rounded-full"
                  onPress={() => setStep("cart")}
                >
                  رجوع للسلة
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- خطوة النجاح ---------- */}
        {step === "success" && (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-trend-sage">
              <CheckCircle2 size={44} className="text-accent" />
            </span>
            <div>
              <p className="text-xl font-black text-trend-ink">
                تم استلام طلبك بنجاح!
              </p>
              <p className="mt-2 text-trend-ink/60">
                لتسريع تأكيد طلبك، أرسله لنا مباشرة عبر واتساب.
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                className="rounded-full bg-accent"
                onPress={handleWhatsApp}
              >
                <MessageCircle size={18} />
                إرسال الطلب عبر واتساب
              </Button>
              <Button
                variant="tertiary"
                size="lg"
                className="rounded-full"
                onPress={() => navigate("/")}
              >
                العودة للمتجر
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
