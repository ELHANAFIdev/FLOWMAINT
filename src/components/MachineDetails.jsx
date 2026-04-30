import { useMemo, useRef } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Download,
  Gauge,
  Package,
  Wrench,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import KpiCard from "./KpiCard";
import Badge from "./Badge";
import StatusBadge from "./StatusBadge";

export default function MachineDetails({ machine, data, lastUpdate, onBack }) {
  const reportRef = useRef(null);

  const machineData = data.filter((d) => d.Machine === machine.name);

  const criticiteStats = useMemo(() => {
    return Object.values(
      machineData.reduce((acc, item) => {
        const name = item.Criticite || "unknown";
        acc[name] = acc[name] || { name, value: 0 };
        acc[name].value += 1;
        return acc;
      }, {})
    );
  }, [machineData]);

  const causeStats = useMemo(() => {
    const map = {};
    machineData.forEach((d) => {
      const key = d.Cause || "unknown";
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([cause, count]) => ({ cause, count }));
  }, [machineData]);

  async function exportPDF() {
    const element = reportRef.current;

    async function exportPDF() {
  if (!reportRef.current) return;

  const canvas = await html2canvas(reportRef.current, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#f1f5f9",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${machine.name}-report.pdf`);
}

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`${machine.name}-report.pdf`);
  }

  return (
    <div ref={reportRef} className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <button
          onClick={onBack}
          type="button"
          className="mb-4 flex items-center gap-2 rounded-xl border border-blue-600 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black">{machine.name}</h1>
              <Badge value={machine.last.Criticite} />
              <StatusBadge value={machine.last.Stock_Status} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6 text-sm md:grid-cols-5">
              <Info label="Line" value={machine.line || "-"} />
              <Info label="Technician" value={machine.technician || "-"} />
              <Info label="Part Needed" value={machine.last.Part_Needed || "-"} />
              <Info label="Tickets" value={machine.tickets} />
              <Info label="Last Update" value={lastUpdate || "-"} />
            </div>
          </div>

          <button
            type="button"
            onClick={exportPDF}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow hover:bg-blue-700"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard title="Score Moyen" value={`${machine.avgScore}/100`} icon={<Gauge />} />
        <KpiCard title="Downtime Total" value={`${machine.downtime} min`} icon={<Wrench />} />
        <KpiCard title="Tickets Total" value={machine.tickets} icon={<Activity />} />
        <KpiCard title="Critiques" value={machine.critical} icon={<AlertTriangle />} danger />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:col-span-2">
          <h2 className="mb-4 text-lg font-black">Historique des décisions</h2>

          <div className="overflow-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3 text-left">Ticket</th>
                  <th className="p-3 text-left">Criticité</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Downtime</th>
                  <th className="p-3 text-left">Part</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Cause</th>
                </tr>
              </thead>

              <tbody>
                {machineData.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3 font-semibold">{item.Ticket_ID || "-"}</td>
                    <td className="p-3">
                      <Badge value={item.Criticite} />
                    </td>
                    <td className="p-3">{item.Score}%</td>
                    <td className="p-3">{item.Downtime_min} min</td>
                    <td className="p-3">
                      <StatusBadge value={item.Part_Status} />
                    </td>
                    <td className="p-3">
                      <StatusBadge value={item.Stock_Status} />
                    </td>
                    <td className="p-3">{item.Cause || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-4 text-lg font-black">Analyse criticité</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={criticiteStats}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Évolution du score">
          <LineChart data={machineData}>
            <XAxis dataKey="Ticket_ID" hide />
            <YAxis />
            <Tooltip />
            <Line dataKey="Score" />
          </LineChart>
        </ChartCard>

        <ChartCard title="Downtime">
          <BarChart data={machineData}>
            <XAxis dataKey="Ticket_ID" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Downtime_min" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Causes fréquentes">
          <BarChart data={causeStats}>
            <XAxis dataKey="cause" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ChartCard>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-3 flex items-center gap-2">
          <Package className="text-blue-600" />
          <h2 className="text-lg font-black">Recommandation IA</h2>
        </div>

        <p className="text-sm leading-7 text-slate-600">
          {machine.last.Recommendation ||
            "Maintenance préventive recommandée pour réduire le downtime."}
        </p>

        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">
          Action suggérée :{" "}
          {machine.last.Next_Action || "Inspection complète recommandée."}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="mb-4 text-lg font-black">{title}</h2>

      <ResponsiveContainer width="100%" height={230}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}