import { useEffect, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { getProducts } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "./ProductCard.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
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
  }, [reloadKey]);

  return (
    <section id="products" className="bg-trend-sage py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold text-trend-green-text">
            منتجاتنا
          </span>
          <h2 className="mt-3 text-3xl font-black text-trend-ink sm:text-4xl">
            تشكيلة هذا الأسبوع
          </h2>
          <p className="mt-4 text-trend-ink/60">
            منتجات مختارة بعناية لهذا الأسبوع، بجودة عالية وأفكار ذكية.
          </p>
        </div>

        {isLoading && (
          <div className="mt-12 flex justify-center">
            <Spinner size="lg" className="text-accent" />
          </div>
        )}

        {!isLoading && error && (
          <div className="mx-auto mt-12 max-w-md rounded-3xl bg-white p-8 text-center">
            <p className="font-bold text-trend-ink">تعذر تحميل المنتجات</p>
            <p className="mt-2 text-sm text-trend-ink/60">
              تأكد من اتصالك بالإنترنت وحاول مرة أخرى.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-5 rounded-full bg-accent px-6"
              onPress={() => setReloadKey((k) => k + 1)}
            >
              إعادة المحاولة
            </Button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addItem}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <p className="mt-12 text-center text-trend-ink/50">
            لا توجد منتجات حالياً.
          </p>
        )}
      </div>
    </section>
  );
}