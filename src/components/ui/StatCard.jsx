import clsx from "clsx";

const TONES = {
  brand: "bg-brand-soft text-brand-dark",
  amber: "bg-amber-soft text-amber",
  neutral: "bg-bg text-ink-soft",
  rust: "bg-rust-soft text-rust",
  emerald: "bg-emerald-50 text-emerald-700",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  loading,
  description,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-xs transition hover:border-brand/40">
      <span
        className={clsx(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          TONES[tone] || TONES.neutral
        )}
      >
        <Icon className="h-5.5 w-5.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-ink-soft">{label}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          {loading ? (
            <div className="h-7 w-16 animate-pulse rounded bg-border/60" />
          ) : (
            <p className="font-mono text-2xl font-semibold tracking-tight text-ink">
              {value ?? 0}
            </p>
          )}
        </div>
        {description && <p className="mt-0.5 text-[11px] text-ink-soft">{description}</p>}
      </div>
    </div>
  );
}