export default function Spinner({ label = "Memuat..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-ink-soft">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
