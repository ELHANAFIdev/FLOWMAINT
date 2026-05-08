import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Factory,
  Gauge,
  PackageCheck,
  PackageX,
  RefreshCcw,
  Search,
  Wrench,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import KpiCard from "./KpiCard";
import Badge from "./Badge";
import StatusBadge from "./StatusBadge";
import SmartAlerts from "./SmartAlerts";

export default function DashboardHome({
  data,
  machines,
  lastUpdate,
  loading,
  onRefresh,
  onSelectMachine,
}) {
  const [search, setSearch] = useState("");
  const [critFilter, setCritFilter] = useState("all");

  const filteredMachines = machines.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCrit = critFilter === "all" || m.last.Criticite === critFilter;
    return matchSearch && matchCrit;
  });

  const totalTickets = data.length;
  const totalMachines = machines.length;
  const criticalTickets = data.filter((d) => d.Criticite === "critique").length;
  const totalDowntime = data.reduce((s, d) => s + d.Downtime_min, 0);

  const avgScore = totalTickets
    ? Math.round(data.reduce((s, d) => s + d.Score, 0) / totalTickets)
    : 0;

  const partsAvailable = data.filter((d) => d.Part_Status === "disponible").length;
  const partsMissing = data.filter((d) => d.Part_Status === "non_disponible").length;
  const avgDowntime = totalTickets ? Math.round(totalDowntime / totalTickets) : 0;

  const criticiteChart = useMemo(() => {
    const map = {};
    data.forEach((d) => {
      const key = d.Criticite || "unknown";
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [data]);

  const downtimeChart = machines.map((m) => ({
    machine: m.name,
    downtime: m.downtime,
  }));

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></span>
              <p className="text-xs font-bold tracking-widest text-blue-300 uppercase">
                MAINTENANCE 360 — Smart Industrial Hub
              </p>
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Operational <span className="text-blue-400">Intelligence</span>
            </h1>
            <p className="mt-3 max-w-xl text-lg text-slate-300/90 leading-relaxed font-medium">
              Système de surveillance MAINTENANCE 360 : Monitoring en temps réel, diagnostics intelligents et pilotage de la performance.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Activity size={14} className="text-blue-400" />
              <span>Dernière synchronisation : {lastUpdate || "En attente..."}</span>
            </div>
          </div>

          <button
            onClick={onRefresh}
            type="button"
            className="group flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 shadow-lg transition-all hover:scale-105 hover:bg-blue-50 active:scale-95"
          >
            <RefreshCcw size={20} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
            <span>{loading ? "Chargement..." : "Actualiser"}</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Machines Actives" value={totalMachines} icon={<Factory size={22} />} />
        <KpiCard title="Total Interventions" value={totalTickets} icon={<Activity size={22} />} />
        <KpiCard title="Alertes Critiques" value={criticalTickets} icon={<AlertTriangle size={22} />} danger />
        <KpiCard title="Score Global" value={`${avgScore}%`} icon={<Gauge size={22} />} />
        <KpiCard title="Temps d'Arrêt Total" value={`${totalDowntime} min`} icon={<Wrench size={22} />} />
        <KpiCard title="MTTR Moyen" value={`${avgDowntime} min`} icon={<Gauge size={22} />} />
        <KpiCard title="Pièces en Stock" value={partsAvailable} icon={<PackageCheck size={22} />} />
        <KpiCard title="Ruptures Stock" value={partsMissing} icon={<PackageX size={22} />} danger />
      </div>

      <SmartAlerts data={data} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Downtime par Machine</h2>
            <div className="h-1.5 w-12 rounded-full bg-blue-100"></div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={downtimeChart}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="machine" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="downtime" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-100">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Répartition Criticité</h2>
            <div className="h-1.5 w-12 rounded-full bg-blue-100"></div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={criticiteChart}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  stroke="none"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters & Table Section */}
      <div className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-4 p-2 md:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-2xl border-none bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher une machine (ex: CNC-01)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={critFilter}
            onChange={(e) => setCritFilter(e.target.value)}
            className="rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-bold outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les niveaux</option>
            <option value="critique">🔴 Critique</option>
            <option value="moyenne">🟠 Moyenne</option>
            <option value="faible">🟢 Faible</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="border-b border-slate-50 px-8 py-6">
          <h2 className="text-2xl font-black text-slate-900">Vue d'ensemble des Machines</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Détails des dernières interventions et états opérationnels
          </p>
        </div>

        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full min-w-[1000px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Machine</th>
                <th className="px-6 py-4">Priorité</th>
                <th className="px-6 py-4 text-center">Score IA</th>
                <th className="px-6 py-4 text-center">Downtime</th>
                <th className="px-6 py-4">Pièces</th>
                <th className="px-6 py-4">Cause probable</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMachines.map((machine) => (
                <tr key={machine.name} className="group transition-all hover:translate-x-1">
                  <td className="rounded-l-2xl bg-slate-50/50 px-6 py-5 group-hover:bg-blue-50/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold">
                        {machine.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{machine.name}</p>
                        <p className="text-xs font-medium text-slate-400">{machine.line}</p>
                      </div>
                    </div>
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 group-hover:bg-blue-50/50">
                    <Badge value={machine.last.Criticite} />
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 text-center group-hover:bg-blue-50/50">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-sm font-black shadow-sm ring-1 ring-slate-100">
                      <Gauge size={14} className="text-blue-500" />
                      {machine.avgScore}%
                    </div>
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 text-center font-bold text-slate-700 group-hover:bg-blue-50/50">
                    {machine.downtime} <span className="text-[10px] text-slate-400 font-medium">min</span>
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 group-hover:bg-blue-50/50">
                    <StatusBadge value={machine.last.Part_Status} />
                  </td>
                  <td className="bg-slate-50/50 px-6 py-5 group-hover:bg-blue-50/50">
                    <p className="max-w-[150px] truncate text-xs font-medium text-slate-600" title={machine.last.Cause}>
                      {machine.last.Cause || "Aucune cause détectée"}
                    </p>
                  </td>
                  <td className="rounded-r-2xl bg-slate-50/50 px-6 py-5 text-right group-hover:bg-blue-50/50">
                    <button
                      type="button"
                      onClick={() => onSelectMachine(machine)}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-blue-600 active:scale-95"
                    >
                      Détails
                      <Activity size={14} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMachines.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-slate-100 p-4">
                        <Search size={32} className="text-slate-300" />
                      </div>
                      <p className="text-lg font-bold text-slate-400">Aucun résultat trouvé</p>
                      <p className="text-sm text-slate-500">Essayez de modifier vos filtres ou votre recherche.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}