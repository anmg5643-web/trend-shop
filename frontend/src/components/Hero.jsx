import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Headphones,
  Watch,
  Coffee,
  ShoppingBag,
} from "lucide-react";

const trust = [
  { icon: Truck, label: "شحن سريع لكل المدن" },
  { icon: ShieldCheck, label: "دفع آمن 100%" },
  { icon: RotateCcw, label: "إرجاع مجاني خلال 14 يوم" },
];

const showcase = [Headphones, Watch, Coffee, ShoppingBag];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-14 pb-28 sm:pt-20"
    >
      {/* توهج عضوي في الخلفية */}
      <div className="trend-glow pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full" />
      <div className="pointer-events-none absolute top-40 -right-32 h-[360px] w-[360px] rounded-full bg-trend-sage" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
        {/* النص */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-trend-sage px-4 py-1.5 text-sm font-semibold text-trend-green-text">
            <Sparkles size={16} />
            أحدث المنتجات · أفكار ذكية · استخدام أسهل
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.15] text-trend-ink sm:text-5xl lg:text-[3.4rem]">
            كل شي <span className="text-accent">رائج</span>… بين إيديك
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-trend-ink/70">
            من الإلكترونيات إلى الأزياء ومستلزمات المنزل — منتجات مختارة
            بعناية، بأفكار ذكية وتجربة تسوق أسهل من أي وقت مضى.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              className="rounded-full bg-accent px-8"
              onPress={() =>
                document
                  .querySelector("#products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              تسوق الآن
              <ArrowLeft size={18} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-trend-pine/20 px-8 text-trend-ink"
              onPress={() =>
                document
                  .querySelector("#about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              تعرف علينا
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {trust.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-trend-ink/60"
              >
                <Icon size={18} className="text-accent" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* الجانب البصري */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg"
        >
          <div className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-trend-pine to-accent p-8 shadow-2xl">
            <div className="grid h-full grid-cols-2 gap-4">
              {showcase.map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm"
                >
                  <span className="flex size-16 items-center justify-center rounded-2xl bg-white text-trend-pine sm:size-20">
                    <Icon size={32} strokeWidth={1.6} />
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 right-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:right-10"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-trend-sage text-trend-pine">
              <Sparkles size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-trend-ink">تشكيلة جديدة</p>
              <p className="text-xs text-trend-ink/60">هذا الأسبوع</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute -bottom-2 left-2 rounded-2xl bg-white px-5 py-4 shadow-xl sm:left-8"
          >
            <p className="text-xs text-trend-ink/60">تقييم عملائنا</p>
            <p className="text-2xl font-black text-trend-pine">4.9 / 5</p>
          </motion.div>
        </motion.div>
      </div>

      {/* موجة عضوية فاصلة بأسفل القسم — عنصر الإشارة البصري */}
      <svg
        viewBox="0 0 1440 110"
        className="absolute bottom-0 left-0 w-full text-trend-sage"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,48 L1440,110 L0,110 Z"
        />
      </svg>
    </section>
  );
}
