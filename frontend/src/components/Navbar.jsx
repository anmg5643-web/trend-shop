import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Badge } from "@heroui/react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const navItems = [
  { label: "الرئيسية", href: "#home" },
  { label: "المنتجات", href: "#products" },
  { label: "من نحن", href: "#about" },
  { label: "مناطق التوصيل", href: "#cities" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const CartIcon = (
    <Link to="/cart" aria-label="سلة المشتريات" className="block p-1.5">
      <Badge.Anchor>
        <ShoppingCart className="text-trend-ink" size={22} />
        {totalItems > 0 && (
          <Badge color="accent" variant="primary" placement="top-right" size="sm">
            {totalItems}
          </Badge>
        )}
      </Badge.Anchor>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-separator bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* الشعار */}
        <Link to="/#home" className="flex shrink-0 items-center gap-2">
          <img src="/logo-icon.png" alt="Trend Shop" className="h-9 w-auto" />
          <span className="text-xl font-extrabold text-trend-ink">
            <span className="text-accent">Trend</span> Shop
          </span>
        </Link>

        {/* روابط التصفح - الشاشات الكبيرة */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={`/${item.href}`}
                className="text-[15px] font-medium text-trend-ink/80 transition-colors hover:text-trend-green-text"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* الإجراءات */}
        <div className="flex items-center gap-2">
          {CartIcon}
          <div className="hidden md:block">
            <Button
              variant="primary"
              size="sm"
              className="rounded-full bg-accent px-5"
              onPress={() => navigate("/#products")}
            >
              تسوق الآن
            </Button>
          </div>
          <button
            aria-label="فتح القائمة"
            aria-expanded={isMenuOpen}
            className="flex items-center justify-center rounded-full p-2 text-trend-ink hover:bg-trend-sage lg:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال والتابلت */}
      {isMenuOpen && (
        <div className="border-t border-separator bg-white lg:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={`/${item.href}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-trend-ink hover:bg-trend-sage"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}