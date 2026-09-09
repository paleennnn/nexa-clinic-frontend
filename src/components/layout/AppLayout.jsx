import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { NAV_ITEMS } from "../../utils/navConfig";

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = NAV_ITEMS.find((item) => pathname.startsWith(item.path))?.label ?? "Nexa Clinic";

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
