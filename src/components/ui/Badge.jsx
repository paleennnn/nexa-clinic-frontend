import clsx from "clsx";

const TONES = {
  neutral: "bg-bg text-ink-soft border-border",
  brand: "bg-brand-soft text-brand-dark border-brand/20",
  amber: "bg-amber-soft text-amber border-amber/30",
  rust: "bg-rust-soft text-rust border-rust/30",
};

export default function Badge({ tone = "neutral", children, className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
