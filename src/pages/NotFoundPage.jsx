import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-4 text-center">
      <FileQuestion className="h-10 w-10 text-ink-soft" />
      <h1 className="text-lg font-semibold text-ink">Halaman tidak ditemukan</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        Alamat yang kamu tuju tidak tersedia.
      </p>
      <Link to="/">
        <Button variant="secondary" className="mt-2">
          Kembali
        </Button>
      </Link>
    </div>
  );
}
