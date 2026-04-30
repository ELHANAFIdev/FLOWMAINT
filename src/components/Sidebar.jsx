import { Home, Wrench, Activity, BarChart3, Bell, Settings } from "lucide-react";

export default function Sidebar({ notificationsCount, page, setPage }) {
  return (
    <aside className="hidden w-64 shrink-0 bg-slate-950 p-6 text-white md:block">
      <h2 className="text-2xl font-black">
        <span className="text-blue-500">FLOW</span> MAINT
      </h2>

      <p className="mt-1 text-sm text-slate-400">Smart Maintenance</p>

      <nav className="mt-10 space-y-3 text-sm">
        <Menu icon={<Home size={19} />} label="Dashboard" active={page === "dashboard"} onClick={() => setPage("dashboard")} />
        <Menu icon={<Wrench size={19} />} label="Machines" active={page === "machines"} onClick={() => setPage("machines")} />
        <Menu icon={<Activity size={19} />} label="Tickets" active={page === "tickets"} onClick={() => setPage("tickets")} />
        <Menu icon={<BarChart3 size={19} />} label="Analytics" active={page === "analytics"} onClick={() => setPage("analytics")} />
        <Menu icon={<Bell size={19} />} label="Notifications" active={page === "notifications"} badge={notificationsCount} onClick={() => setPage("notifications")} />
        <Menu icon={<Settings size={19} />} label="Settings" active={page === "settings"} onClick={() => setPage("settings")} />
      </nav>
    </aside>
  );
}

function Menu({ icon, label, active, badge, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 transition ${
        active ? "bg-blue-600 text-white shadow" : "text-slate-300 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>

      {badge > 0 && (
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
          {badge}
        </span>
      )}
    </button>
  );
}