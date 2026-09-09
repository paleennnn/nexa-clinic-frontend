import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_LABELS } from "../../utils/roles";
import Button from "../ui/Button";

export default function Topbar({ title }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="text-lg font-semibold text-ink">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-ink">{user?.name}</p>
          <p className="text-xs text-ink-soft">{ROLE_LABELS[user?.role]}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </header>
  );
}
