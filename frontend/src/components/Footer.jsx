import { MessageCircle, Music2 } from "lucide-react";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "218945630859";

const links = [
  { label: "الرئيسية", href: "#home" },
  { label: "المنتجات", href: "#products" },
  { label: "من نحن", href: "#about" },
];

const socials = [
  {
    icon: MessageCircle,
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("مرحباً، عندي استفسار عن Trend Shop")}`,
    label: "واتساب",
  },
  {
    icon: Music2,
    href: "https://www.tiktok.com/@trendshop7761",
    label: "تيك توك",
  },
];

export default function Footer() {
  return (
    <footer className="bg-trend-pine text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <a href="#home" className="flex items-center gap-2">
              <img src="/logo-icon.png" alt="Trend Shop" className="h-9 w-auto" />
              <span className="text-xl font-extrabold">
                <span className="text-trend-fresh">Trend</span> Shop
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/60">
              أحدث المنتجات · أفكار ذكية · استخدام أسهل.
            </p>
          </div>

          <div>
            <p className="font-bold">روابط سريعة</p>
            <ul className="mt-4 space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold">تابعنا</p>
            <div className="mt-4 flex gap-3">
              {socials.map(({ icon: Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-trend-fresh hover:text-trend-pine"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Trend Shop. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
