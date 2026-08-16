import { motion } from "framer-motion";
import { ShieldCheck, Truck, MessageCircle, TrendingUp } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "جودة موثوقة",
    desc: "كل منتج يمر بفحص دقيق قبل وصوله إليك.",
  },
  {
    icon: Truck,
    title: "توصيل سريع",
    desc: "شحن إلى جميع المدن في أسرع وقت ممكن.",
  },
  {
    icon: MessageCircle,
    title: "دعم دائم",
    desc: "فريقنا جاهز لمساعدتك في أي وقت تحتاجه.",
  },
];

const stats = [
  { value: "+50K", label: "عميل سعيد" },
  { value: "+1200", label: "منتج متنوع" },
  { value: "15", label: "مدينة نخدمها" },
  { value: "4.9", label: "تقييم العملاء" },
];

export default function AboutUs() {
  return (
    <section id="about" className="relative overflow-hidden bg-trend-sage py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        {/* البصري */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative order-2 lg:order-1"
        >
          <div className="rounded-[2.5rem] bg-trend-pine p-10 text-white shadow-xl">
            <TrendingUp size={40} className="text-trend-fresh" />
            <p className="mt-6 text-2xl font-bold leading-relaxed">
              "نؤمن أن التسوق الذكي يبدأ باختيار صحيح، وسهل، وبدون تعقيد."
            </p>
            <p className="mt-6 text-sm text-white/60">— فريق Trend Shop</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white p-5 text-center shadow-sm"
              >
                <p className="text-2xl font-black text-trend-pine">{s.value}</p>
                <p className="mt-1 text-xs text-trend-ink/60">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* النص */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2"
        >
          <span className="text-sm font-bold uppercase tracking-wider text-trend-green-text">
            من نحن
          </span>
          <h2 className="mt-3 text-3xl font-black leading-tight text-trend-ink sm:text-4xl">
            Trend Shop… وجهتك لكل ما هو جديد
          </h2>
          <p className="mt-6 leading-8 text-trend-ink/70">
            انطلقنا من فكرة بسيطة: أن يجد كل عميل ما يحتاجه فعلاً دون عناء
            البحث في مواقع متفرقة. اليوم نجمع لك أحدث المنتجات وأفكار ذكية
            من فئات متعددة في مكان واحد أنيق وسهل الاستخدام، مع فريق يهتم
            بتفاصيل تجربتك من الطلب حتى الاستلام.
          </p>

          <div className="mt-8 space-y-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-trend-pine shadow-sm">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-bold text-trend-ink">{title}</p>
                  <p className="text-sm text-trend-ink/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
