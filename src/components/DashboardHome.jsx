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
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-300">
              FLOWMANINT — Smart Factory
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Industrial Maintenance Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Monitoring IoT, diagnostic IA, suivi downtime et décisions finales.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Last update: {lastUpdate || "-"}
            </p>
          </div>

          <button
            onClick={onRefresh}
            type="button"
            className="flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-950 shadow hover:bg-blue-50"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Loading..." : "Refresh Data"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Machines" value={totalMachines} icon={<Factory />} />
        <KpiCard title="Total Tickets" value={totalTickets} icon={<Activity />} />
        <KpiCard title="Critical Tickets" value={criticalTickets} icon={<AlertTriangle />} danger />
        <KpiCard title="Average Score" value={`${avgScore}%`} icon={<Gauge />} />
        <KpiCard title="Total Downtime" value={`${totalDowntime} min`} icon={<Wrench />} />
        <KpiCard title="Avg Downtime" value={`${avgDowntime} min`} icon={<Gauge />} />
        <KpiCard title="Parts Available" value={partsAvailable} icon={<PackageCheck />} />
        <KpiCard title="Parts Missing" value={partsMissing} icon={<PackageX />} danger />
      </div>

      <SmartAlerts data={data} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 xl:col-span-2">
          <h2 className="mb-4 text-lg font-black">Downtime par machine</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={downtimeChart}>
              <XAxis dataKey="machine" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="downtime" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-4 text-lg font-black">Répartition criticité</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={criticiteChart}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input
              className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
              placeholder="Search machine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={critFilter}
            onChange={(e) => setCritFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="all">Toutes criticités</option>
            <option value="critique">Critique</option>
            <option value="moyenne">Moyenne</option>
            <option value="faible">Faible</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-5">
          <h2 className="text-xl font-black">Machines Overview</h2>
          <p className="text-sm text-slate-500">
            Résumé des décisions finales par machine
          </p>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4 text-left">Machine</th>
                <th className="p-4 text-left">Criticité</th>
                <th className="p-4 text-left">Score</th>
                <th className="p-4 text-left">Downtime</th>
                <th className="p-4 text-left">Part Status</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Cause</th>
                <th className="p-4 text-left">Technician</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMachines.map((machine) => (
                <tr key={machine.name} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-black">{machine.name}</p>
                    <p className="text-xs text-slate-400">{machine.line}</p>
                  </td>
                  <td className="p-4">
                    <Badge value={machine.last.Criticite} />
                  </td>
                  <td className="p-4 font-bold">{machine.avgScore}%</td>
                  <td className="p-4">{machine.downtime} min</td>
                  <td className="p-4">
                    <StatusBadge value={machine.last.Part_Status} />
                  </td>
                  <td className="p-4">
                    <StatusBadge value={machine.last.Stock_Status} />
                  </td>
                  <td className="p-4">{machine.last.Cause || "-"}</td>
                  <td className="p-4">{machine.technician || "-"}</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => onSelectMachine(machine)}
                      className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMachines.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    No machines found
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