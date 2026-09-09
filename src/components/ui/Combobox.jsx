import { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import clsx from "clsx";

/**
 * Controlled searchable dropdown. The parent owns `query` (what's typed) and
 * `options` (already filtered/fetched, e.g. via a debounced patient search) —
 * this component only handles the open/close + keyboard-free click UX.
 */
export default function Combobox({
  id,
  label,
  placeholder = "Cari...",
  query,
  onQueryChange,
  options,
  onSelect,
  loading,
  error,
  disabled,
  emptyLabel = "Tidak ada hasil",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          className={clsx(
            "h-10 w-full rounded-lg border bg-white px-3 pr-9 text-sm text-ink transition-colors",
            "focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1",
            error ? "border-rust" : "border-border",
            disabled && "bg-bg text-ink-soft"
          )}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
        </span>

        {open && !disabled && (
          <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-white py-1 shadow-lg">
            {options.length === 0 && (
              <p className="px-3 py-2 text-sm text-ink-soft">{emptyLabel}</p>
            )}
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-bg cursor-pointer"
              >
                <span className="font-medium text-ink">{option.label}</span>
                {option.sublabel && (
                  <span className="text-xs text-ink-soft">{option.sublabel}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rust">{error}</p>}
    </div>
  );
}
