import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { createOrder, getFileUrl } from "../lib/api.js";
import { getProductIcon } from "../lib/icons.js";
import { buildOrderWhatsAppLink } from "../lib/whatsapp.js";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState("cart"); // cart | checkout | success
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastOrder, setLastOrder] = useState(null);
  const [lastItems, setLastItems] = useState([]);

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep("cart"), 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.customerName || !form.phone || !form.address) {
      setError("الرجاء تعبئة جميع الحقول المطلوبة");
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* الرأس */}
            <div className="flex shrink-0 items-center justify-between border-b border-separator px-5 py-4">
              <h3 className="text-lg font-bold text-trend-ink">
                {step === "cart" && `سلة المشتريات (${items.length})`}
                {step === "checkout" && "إتمام الطلب"}
                {step === "success" && "تم استلام طلبك"}
              </h3>
              <button
                onClick={handleClose}
                aria-label="إغلاق"
                className="rounded-full p-2 text-trend-ink/60 hover:bg-trend-sage"
              >
                <X size={20} />
              </button>
            </div>

            {/* المحتوى */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {step === "cart" && (
                <>
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-trend-ink/50">
                      <ShoppingBag size={40} />
                      <p>سلتك فارغة حالياً</p>
                      <Button
                        variant="tertiary"
                        size="sm"
                        className="rounded-full"
                        onPress={handleClose}
                      >
                        تصفّح المنتجات
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {items.map((item) => {
                        const Icon = getProductIcon(item.icon);
                        const imageUrl = getFileUrl(item.image);
                        return (
                          <li
                            key={item.productId}
                            className="flex items-center gap-3 rounded-2xl border border-separator/60 p-3"
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="size-14 shrink-0 rounded-xl object-cover"
                              />
                            ) : (
                              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-trend-sage text-trend-pine">
                                <Icon size={24} strokeWidth={1.7} />
                              </span>
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="truncate font-bold text-trend-ink">
                                {item.name}
                              </p>
                              <p className="mt-0.5 text-sm text-trend-ink/50">
                                {item.price} د.ل × {item.quantity} ={" "}
                                <span className="font-semibold text-trend-ink">
                                  {item.price * item.quantity} د.ل
                                </span>
                              </p>

                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.productId, item.quantity - 1)
                                  }
                                  className="flex size-7 items-center justify-center rounded-full bg-trend-sage text-trend-pine"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-6 text-center font-bold text-trend-ink">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.productId, item.quantity + 1)
                                  }
                                  className="flex size-7 items-center justify-center rounded-full bg-trend-sage text-trend-pine"
                                >
                                  <Plus size={14} />
                                </button>

                                <button
                                  onClick={() => removeItem(item.productId)}
                                  aria-label="حذف"
                                  className="mr-auto text-trend-ink/40 hover:text-red-600"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}

              {step === "checkout" && (
                <>
                  {/* ملخص مختصر للمنتجات المختارة حتى لا يفقد الزبون السياق */}
                  <div className="mb-5 rounded-2xl bg-trend-sage p-4">
                    <p className="mb-2 text-sm font-bold text-trend-ink">
                      ملخص طلبك
                    </p>
                    <ul className="space-y-1.5">
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
                  </div>

                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
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
                        onChange={(e) =>
                          setForm({ ...form, customerName: e.target.value })
                        }
                        className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
                        placeholder="مثال: محمد علي"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                        رقم الهاتف
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
                        placeholder="09xxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                        العنوان
                      </label>
                      <input
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
                        placeholder="المدينة، الحي، أقرب معلم"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-trend-ink">
                        ملاحظات (اختياري)
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={2}
                        className="w-full rounded-xl border border-separator px-4 py-2.5 outline-none focus:border-accent"
                      />
                    </div>
                  </form>
                </>
              )}

              {step === "success" && (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-trend-sage">
                    <CheckCircle2 size={34} className="text-accent" />
                  </span>
                  <div>
                    <p className="text-lg font-bold text-trend-ink">
                      تم استلام طلبك بنجاح!
                    </p>
                    <p className="mt-1 text-sm text-trend-ink/60">
                      لتسريع تأكيد طلبك، أرسله لنا مباشرة عبر واتساب.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    className="rounded-full bg-accent"
                    onPress={handleWhatsApp}
                  >
                    <MessageCircle size={18} />
                    إرسال الطلب عبر واتساب
                  </Button>
                </div>
              )}
            </div>

            {/* التذييل */}
            {step !== "success" && items.length > 0 && (
              <div className="shrink-0 border-t border-separator px-5 py-4">
                <div className="mb-3 flex items-center justify-between text-base font-bold text-trend-ink">
                  <span>الإجمالي</span>
                  <span>{totalPrice} د.ل</span>
                </div>
                {step === "cart" ? (
                  <Button
                    variant="primary"
                    fullWidth
                    className="rounded-full bg-accent"
                    onPress={() => setStep("checkout")}
                  >
                    متابعة إتمام الطلب
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="tertiary"
                      className="rounded-full"
                      onPress={() => setStep("cart")}
                    >
                      رجوع
                    </Button>
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
                  </div>
                )}
              </div>
            )}

            {step === "success" && (
              <div className="shrink-0 border-t border-separator px-5 py-4">
                <Button
                  variant="tertiary"
                  fullWidth
                  className="rounded-full"
                  onPress={handleClose}
                >
                  إغلاق
                </Button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
