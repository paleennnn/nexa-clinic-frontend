import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Cross } from "lucide-react";
import { NAV_ITEMS } from "../../utils/navConfig";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-ink text-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
          <Cross className="h-4.5 w-4.5" strokeWidth={2.5} />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Nexa Clinic</p>
          <p className="text-xs text-white/50">Sistem Informasi Klinik</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          if (item.comingSoon) {
            return (
              <div
                key={item.path}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/35"
                title="Segera hadir"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className="text-[10px] uppercase tracking-wide">Segera</span>
              </div>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-brand text-white font-medium"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
