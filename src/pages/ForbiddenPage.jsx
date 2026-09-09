import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Button from "../components/ui/Button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-4 text-center">
      <ShieldAlert className="h-10 w-10 text-rust" />
      <h1 className="text-lg font-semibold text-ink">Akses ditolak</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        Role kamu tidak memiliki izin untuk membuka halaman ini.
      </p>
      <Link to="/patients">
        <Button variant="secondary" className="mt-2">
          Kembali ke Data Pasien
        </Button>
      </Link>
    </div>
  );
}
