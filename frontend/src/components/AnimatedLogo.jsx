export default function AnimatedLogo({ className = "", onDark = false }) {
  const primary = onDark ? "text-white" : "text-trend-ink";

  return (
    <span
      role="img"
      aria-label="Baz SHOP"
      className={`inline-flex flex-col items-center justify-center leading-none ${className}`}
    >
      <span className="whitespace-nowrap text-[30px] font-black italic tracking-[-0.09em]">
        <span className={primary}>B</span>
        <span className="text-trend-fresh">az</span>
      </span>
      <span className={`-mt-0.5 whitespace-nowrap text-[10px] font-extrabold tracking-[0.32em] ${primary}`}>
        SHOP
      </span>
    </span>
  );
}
