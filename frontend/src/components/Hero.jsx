import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const trust = [
  { icon: Truck,},
  { icon: ShieldCheck,},
  { icon: RotateCcw,},
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-14 pb-28 sm:pt-20"
    >
      {/* توهج عضوي في الخلفية */}
      <div className="trend-glow pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full" />
      <div className="pointer-events-none absolute top-40 -right-32 h-[360px] w-[360px] rounded-full bg-trend-sage" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >

          <h1 className="mt-6 text-4xl font-black leading-[1.15] text-trend-ink sm:text-5xl lg:text-[3.4rem]">
            كل شي <span className="text-accent">رائج</span>… بين إيديك
          </h1>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
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

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
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
      </div>

      {/* موجة عضوية فاصلة بأسفل القسم */}
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