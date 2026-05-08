import { Home, Wrench, Activity, BarChart3, Bell, Settings } from "lucide-react";
import logo from "../assets/logo.png";


export default function Sidebar({ notificationsCount, page, setPage }) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col bg-slate-950 p-8 text-white md:flex">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 blur"></div>
          <img src={logo} alt="Logo" className="relative h-32 w-auto object-contain" />
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-xl font-black tracking-tighter text-white">MAINTENANCE<span className="text-blue-500"> 360</span></h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Smart Maintenance OS</p>
        </div>
      </div>

      <nav className="mt-12 flex-1 space-y-2">
        <Menu icon={<Home size={20} />} label="Tableau de bord" active={page === "dashboard"} onClick={() => setPage("dashboard")} />
        <Menu icon={<Wrench size={20} />} label="Parc Machines" active={page === "machines"} onClick={() => setPage("machines")} />
        <Menu icon={<Activity size={20} />} label="Interventions" active={page === "tickets"} onClick={() => setPage("tickets")} />
        <Menu icon={<BarChart3 size={20} />} label="Analyses" active={page === "analytics"} onClick={() => setPage("analytics")} />
        <Menu icon={<Bell size={20} />} label="Alertes" active={page === "notifications"} badge={notificationsCount} onClick={() => setPage("notifications")} />
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-900">
        <Menu icon={<Settings size={20} />} label="Paramètres" active={page === "settings"} onClick={() => setPage("settings")} />
      </div>
    </aside>
  );
}

function Menu({ icon, label, active, badge, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 ${
        active 
          ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]" 
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
          {icon}
        </div>
        <span className="text-sm font-bold">{label}</span>
      </div>

      {badge > 0 && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white shadow-lg">
          {badge}
        </span>
      )}

      {active && (
        <div className="absolute -left-2 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_white]"></div>
      )}
    </button>
  );
}