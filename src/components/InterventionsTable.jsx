import Badge from "./Badge";
import StatusBadge from "./StatusBadge";
import { Search, Filter, Activity, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function InterventionsTable({ data }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = data.filter((item) => {
    const matchSearch = 
      item.Machine.toLowerCase().includes(search.toLowerCase()) ||
      item.Ticket_ID.toLowerCase().includes(search.toLowerCase()) ||
      item.Cause.toLowerCase().includes(search.toLowerCase());
    
    const matchFilter = filter === "all" || item.Criticite === filter;
    
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-black">Historique des <span className="text-blue-500">Interventions</span></h1>
          <p className="mt-2 text-slate-400 font-medium">Flux de données en temps réel provenant du système central.</p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <StatMini icon={<Activity size={14}/>} label="Total" value={data.length} color="bg-blue-500"/>
            <StatMini icon={<AlertCircle size={14}/>} label="High" value={data.filter(d => d.Criticite === 'high').length} color="bg-red-500"/>
            <StatMini icon={<Clock size={14}/>} label="Downtime Total" value={`${data.reduce((s,d) => s + d.Downtime_min, 0)} min`} color="bg-amber-500"/>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-sm font-medium outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-blue-500 shadow-sm"
            placeholder="Rechercher par Ticket, Machine ou Cause..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-2xl border-none bg-white px-6 py-4 text-sm font-bold outline-none ring-1 ring-slate-200 shadow-sm transition focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Toutes les criticités</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟠 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full min-w-[1000px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Date / ID</th>
                <th className="px-6 py-4">Machine</th>
                <th className="px-6 py-4">Criticité</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Downtime</th>
                <th className="px-6 py-4">Cause & Solution</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, i) => (
                <tr key={i} className="group transition-all hover:translate-x-1">
                  <td className="rounded-l-2xl bg-slate-50/50 px-6 py-5 group-hover:bg-blue-50/50">
                    <p className="font-black text-slate-900 text-xs">#{item.Ticket_ID || item.Decision_ID}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">{item.Timestamp}</p>
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 group-hover:bg-blue-50/50 font-bold text-slate-800">
                    {item.Machine}
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 group-hover:bg-blue-50/50">
                    <Badge value={item.Criticite} />
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 text-center group-hover:bg-blue-50/50">
                    <span className="text-sm font-black text-blue-600">{item.Score}%</span>
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 text-center font-bold text-slate-700 group-hover:bg-blue-50/50">
                    {item.Downtime_min} <span className="text-[10px] text-slate-400 font-medium">min</span>
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 group-hover:bg-blue-50/50 max-w-xs">
                    <p className="font-bold text-slate-800 text-xs truncate" title={item.Cause}>{item.Cause || "N/A"}</p>
                    <p className="text-[10px] text-slate-400 mt-1 truncate" title={item.Next_Action}>{item.Next_Action}</p>
                  </td>
                  <td className="rounded-r-2xl bg-slate-50/50 px-6 py-5 group-hover:bg-blue-50/50">
                    <StatusBadge value={item.Part_Status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatMini({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 ring-1 ring-white/10">
      <div className={`p-1.5 rounded-lg ${color} text-white`}>{icon}</div>
      <div>
        <p className="text-[10px] text-slate-500 font-bold uppercase">{label}</p>
        <p className="text-sm font-black">{value}</p>
      </div>
    </div>
  );
}