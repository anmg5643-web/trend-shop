import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { ArrowRight, Star, Minus, Plus, ShoppingCart, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { getProduct, getFileUrl } from "../lib/api.js";
import { getProductIcon } from "../lib/icons.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setAdded(false);
    setQuantity(1);

    getProduct(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "تعذر جلب بيانات المنتج");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setAdded(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          to="/#products"
          className="inline-flex items-center gap-2 text-sm font-medium text-trend-ink/60 hover:text-accent"
        >
          <ArrowRight size={16} />
          الرجوع للمنتجات
        </Link>

        {loading && <p className="mt-10 text-center text-trend-ink/50">جاري التحميل...</p>}

        {!loading && error && (
          <div className="mt-10 rounded-2xl bg-trend-sage p-8 text-center">
            <p className="font-bold text-trend-ink">تعذر إيجاد هذا المنتج</p>
            <p className="mt-2 text-sm text-trend-ink/60">{error}</p>
          </div>
        )}

        {!loading && !error && product && (
          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* الصورة / الأيقونة */}
            <div className="flex aspect-square items-center justify-center rounded-[2.5rem] bg-trend-sage">
              {getFileUrl(product.image) ? (
                <img
                  src={getFileUrl(product.image)}
                  alt={product.name}
                  className="h-full w-full rounded-[2.5rem] object-cover"
                />
              ) : (
                (() => {
                  const Icon = getProductIcon(product.icon);
                  return <Icon size={120} strokeWidth={1.3} className="text-trend-pine" />;
                })()
              )}
            </div>

            {/* التفاصيل */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-trend-green-text">
                {product.categoryLabel}
              </p>
              <h1 className="mt-2 text-3xl font-black text-trend-ink sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-trend-ink/60">
                <Star size={18} className="fill-trend-gold text-trend-gold" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-sm">
                  · متوفر بالمخزون: {product.stock}
                </span>
              </div>

              <p className="mt-6 text-3xl font-black text-trend-pine">
                {product.price} <span className="text-lg text-trend-ink/50">د.ل</span>
              </p>

              {product.description && (
                <p className="mt-6 leading-8 text-trend-ink/70">
                  {product.description}
                </p>
              )}

              {/* اختيار الكمية */}
              <div className="mt-8 flex items-center gap-4">
                <span className="font-medium text-trend-ink">الكمية</span>
                <div className="flex items-center gap-3 rounded-full border border-separator px-3 py-1.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex size-7 items-center justify-center rounded-full bg-trend-sage text-trend-pine"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex size-7 items-center justify-center rounded-full bg-trend-sage text-trend-pine"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="mt-8 rounded-full bg-accent sm:w-auto sm:px-10"
                onPress={handleAdd}
              >
                {added ? (
                  <>
                    <CheckCircle2 size={18} />
                    تمت الإضافة للسلة
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    أضف للسلة
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
