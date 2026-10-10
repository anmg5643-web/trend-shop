import { useState } from "react";
import { MapPin } from "lucide-react";

// المدن مأخوذة حرفياً من قائمة التوصيل المرسلة (بدون أسعار).
const regions = [
  {
    name: "طرابلس وضواحيها",
    cities: [
      "طرابلس", "انجيلة", "الكريمية", "السواني", "الزهراء", "السعادية",
      "العزيزية", "السبيعة", "قصر بن غشير", "سوق الخميس مسيحل",
      "خلة الفرجان", "وادي الربيع", "الباعيش", "سوق السبت", "ورشفانة",
    ],
  },
  {
    name: "غرب طرابلس",
    cities: [
      "المايه", "الزاوية", "المطرد", "صرمان", "صبراتة", "زوارة",
      "العجيلات", "الجميل", "رقدالين", "زلطن", "راس اجدير",
    ],
  },
  {
    name: "شرق طرابلس",
    cities: ["القره بولي", "قماطة", "قصر خيار", "الخمس", "زليتن", "مسلاتة"],
  },
  {
    name: "جنوب طرابلس",
    cities: ["ترهونة", "بني وليد"],
  },
  {
    name: "الجبل الغربي",
    cities: [
      "غريان", "الاصابعة", "الرابطة", "القواليش", "العوينة", "القلعة",
      "يفرن", "الرحيبات", "جادو", "كاباو", "الرقيعات", "تيجي", "بدر", "الجوش",
    ],
  },
  {
    name: "المنطقة الوسطى",
    cities: [
      "سرت", "هراوة", "النوفلية", "بن جواد", "راس لانوف", "اجدابيا",
      "هون", "سوكنة", "الودان", "الجفرة", "زلة",
    ],
  },
  {
    name: "المنطقة الشرقية",
    cities: [
      "بنغازي", "توكرة", "المرج", "البيضاء", "قمينس", "سلوق", "شحات",
      "سوسة", "درنة", "القبة", "طبرق", "امساعد",
    ],
  },
  {
    name: "المنطقة الجنوبية",
    cities: [
      "مزدة", "الشويرف", "القريات", "سبها", "براك", "الشاطئ", "اوباري",
      "ام الارانب", "وادي عتبة", "مرزق", "القطرون", "غات",
    ],
  },
  {
    name: "الجنوب الشرقي",
    cities: ["جالو", "اوجلة", "الواحات", "الكفرة"],
  },
];

export default function Cities() {
  const [active, setActive] = useState(0);
  const region = regions[active];

  return (
    <section id="cities" className="bg-trend-sage py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold text-trend-green-text">
            مناطق التوصيل
          </span>
          <h2 className="mt-3 text-3xl font-black text-trend-ink sm:text-4xl">
            المدن اللي نوصل لها
          </h2>
          <p className="mt-4 text-trend-ink/60">
            اختر منطقتك وشوف المدن المشمولة بالتوصيل.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {regions.map((r, i) => (
            <button
              key={r.name}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={
                "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                (i === active
                  ? "bg-accent text-trend-ink"
                  : "bg-white text-trend-ink/70 hover:text-trend-ink")
              }
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-6 max-w-4xl rounded-3xl bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 font-bold text-trend-ink">
            <MapPin size={18} className="text-trend-green-text" />
            {region.name}
            <span className="text-sm font-medium text-trend-ink/50">
              ({region.cities.length})
            </span>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {region.cities.map((city) => (
              <li
                key={city}
                className="rounded-full bg-trend-sage px-4 py-1.5 text-sm text-trend-ink"
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}