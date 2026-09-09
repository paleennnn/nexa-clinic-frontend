import { Users, LayoutDashboard, Stethoscope, ClipboardList, Radio, HeartPulse, History } from "lucide-react";
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
  },
  {
    label: "Data Pasien",
    path: "/patients",
    icon: Users,
    roles: [ROLES.ADMIN, ROLES.PETUGAS_PENDAFTARAN],
  },
  {
    label: "Pendaftaran",
    path: "/registrations",
    icon: ClipboardList,
    roles: [ROLES.ADMIN, ROLES.PETUGAS_PENDAFTARAN],
  },
  {
    label: "Antrean",
    path: "/queue",
    icon: Radio,
    // Dokter perlu memantau antrean poli miliknya, Petugas/Admin yang memanggil antrean.
    roles: null,
  },
  {
    label: "Pemeriksaan",
    path: "/exams",
    icon: HeartPulse,
    // Hanya Dokter yang bisa membuat rekam medis (POST /medical-records authorize('DOKTER')).
    roles: [ROLES.DOKTER],
  },
  {
    label: "Riwayat Aktivitas",
    path: "/activity-history",
    icon: History,
    // Terbuka untuk semua role. Dokter dibatasi melihat riwayat pasiennya sendiri.
    roles: null,
  },
  {
    label: "Poli & Dokter",
    path: "/master-data",
    icon: Stethoscope,
    // Kelola master data ini khusus Admin — role lain memakainya lewat dropdown
    // di modul Pendaftaran, bukan mengelola langsung di sini.
    roles: [ROLES.ADMIN],
  },
];
