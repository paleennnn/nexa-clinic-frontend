import clsx from "clsx";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            "relative px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
            active === tab.value
              ? "text-brand"
              : "text-ink-soft hover:text-ink"
          )}
        >
          {tab.label}
          {active === tab.value && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" />
          )}
        </button>
      ))}
    </div>
  );
}
