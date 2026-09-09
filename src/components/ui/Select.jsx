import { forwardRef } from "react";
import clsx from "clsx";

const Select = forwardRef(function Select(
  { label, error, className, id, children, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={clsx(
          "h-10 rounded-lg border bg-white px-3 text-sm text-ink transition-colors",
          "focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1",
          error ? "border-rust" : "border-border",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rust">{error}</p>}
    </div>
  );
});

export default Select;
