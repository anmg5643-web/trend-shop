import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { getProducts } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "./ProductCard.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");

    getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "تعذر الاتصال بالخادم");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="products" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-trend-green-text">
            منتجاتنا
          </span>
          <h2 className="mt-3 text-3xl font-black text-trend-ink sm:text-4xl">
            تشكيلة هذا الأسبوع
          </h2>
          <p className="mt-4 text-trend-ink/60">
            منتجات مختارة بعناية لهذا الأسبوع، بجودة عالية وأفكار ذكية.
          </p>
        </div>

        {/* حالة التحميل */}
        {isLoading && (
          <div className="mt-16 flex justify-center">
            <Spinner size="lg" className="text-accent" />
          </div>
        )}

        {/* حالة الخطأ (مثلاً الباك إند غير مشغّل بعد) */}
        {!isLoading && error && (
          <div className="mt-16 rounded-2xl bg-trend-sage p-8 text-center">
            <p className="font-bold text-trend-ink">
              تعذر جلب المنتجات من الخادم
            </p>
            <p className="mt-2 text-sm text-trend-ink/60">
              تأكد أن الباك إند يعمل (npm run dev) وأن قاعدة البيانات متصلة.
              <br />
              <span dir="ltr" className="text-xs">
                {error}
              </span>
            </p>
          </div>
        )}

        {/* شبكة المنتجات */}
        {!isLoading && !error && (
          <motion.div
            layout
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addItem}
              />
            ))}
          </motion.div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <p className="mt-16 text-center text-trend-ink/50">
            لا توجد منتجات حالياً.
          </p>
        )}
      </div>
    </section>
  );
}
