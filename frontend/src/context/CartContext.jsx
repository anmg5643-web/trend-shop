import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProducts } from "../lib/api.js";

const CartContext = createContext(null);
const STORAGE_KEY = "alwaha_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // تجاهل أخطاء التخزين المحلي (مثلاً في وضع التصفح الخاص)
    }
  }, [items]);

  // سلات قديمة انحفظت بدون صورة: نكمّلو الصور مرة وحدة من الباك إند عند فتح الموقع
  useEffect(() => {
    if (!items.some((i) => !i.image)) return;
    let cancelled = false;
    getProducts()
      .then((list) => {
        if (cancelled) return;
        const byId = new Map(list.map((p) => [p._id, p]));
        setItems((prev) =>
          prev.map((i) => {
            const image = byId.get(i.productId)?.image;
            return !i.image && image ? { ...i, image } : i;
          }),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          icon: product.icon,
          image: product.image || "",
          quantity: 1,
        },
      ];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  };

  const clearCart = () => setItems([]);

  const { totalItems, totalPrice } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        totalItems: acc.totalItems + i.quantity,
        totalPrice: acc.totalPrice + i.quantity * i.price,
      }),
      { totalItems: 0, totalPrice: 0 },
    );
  }, [items]);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart يجب أن يُستخدم داخل CartProvider");
  return ctx;
}