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

export default function AboutUs() {
  return (
    <section id="about" className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* البصري */}
        <div className="order-2 lg:order-1">
          <div className="rounded-3xl bg-trend-pine p-8 text-white sm:p-10">
            <TrendingUp size={36} className="text-trend-fresh" />
            <p className="mt-6 text-2xl font-bold leading-relaxed">
              "نؤمن أن التسوق الذكي يبدأ باختيار صحيح، وسهل، وبدون تعقيد."
            </p>
            <p className="mt-6 text-sm text-white/60">— فريق Trend Shop</p>
          </div>
        </div>

        {/* النص */}
        <div className="order-1 lg:order-2">
          <span className="text-sm font-bold text-trend-green-text">
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
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-trend-sage text-trend-pine">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-bold text-trend-ink">{title}</p>
                  <p className="text-sm text-trend-ink/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}