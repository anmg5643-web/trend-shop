import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Badge } from "@heroui/react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const navItems = [
  { label: "الرئيسية", href: "#home" },
  { label: "المنتجات", href: "#products" },
  { label: "من نحن", href: "#about" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

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
        <a href="#home" className="flex items-center gap-2 shrink-0">
          <img src="/logo-icon.png" alt="Trend Shop" className="h-9 w-auto" />
          <span className="text-xl font-extrabold text-trend-ink">
            <span className="text-accent">Trend</span> Shop
          </span>
        </a>

        {/* روابط التصفح - سطح المكتب */}
        <ul className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-[15px] font-medium text-trend-ink/80 transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* الإجراءات */}
        <div className="hidden md:flex items-center gap-3">
          {CartIcon}
          <Button
            variant="primary"
            size="sm"
            className="rounded-full bg-accent px-5"
            onPress={() =>
              document
                .querySelector("#products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            تسوق الآن
          </Button>
        </div>

        {/* زر القائمة - الجوال */}
        <div className="flex items-center gap-1 md:hidden">
          {CartIcon}
          <button
            aria-label="فتح القائمة"
            aria-expanded={isMenuOpen}
            className="flex items-center justify-center rounded-full p-2 text-trend-ink hover:bg-trend-sage"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال */}
      {isMenuOpen && (
        <div className="border-t border-separator bg-white md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-trend-ink hover:bg-trend-sage"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
