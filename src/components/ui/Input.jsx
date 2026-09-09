import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx(
          "h-10 w-full min-w-0 rounded-lg border bg-white px-3 text-sm text-ink placeholder:text-ink-soft/50 transition-colors",
          "focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1",
          error ? "border-rust" : "border-border",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rust">{error}</p>}
      {!error && hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </div>
  );
});

export default Input;
