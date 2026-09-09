import { Users, LayoutDashboard } from "lucide-react";
import { ROLES } from "./roles";

// Single source of truth for the sidebar. Add an entry here whenever a new
// module's frontend lands — nothing else needs to change to surface it.
// `roles: null` means visible to everyone authenticated.
export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: null,
    comingSoon: true, // backend GET /api/dashboard/summary belum tersedia
  },
  {
    label: "Data Pasien",
    path: "/patients",
    icon: Users,
    roles: [ROLES.ADMIN, ROLES.PETUGAS_PENDAFTARAN],
  },
];
