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
    const map = {};
    machineData.forEach((item) => {
      const name = item.Criticite || "unknown";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [machineData]);

  const causeStats = useMemo(() => {
    const map = {};
    machineData.forEach((item) => {
      const cause = item.Cause || "unknown";
      map[cause] = (map[cause] || 0) + 1;
    });
    return Object.entries(map).map(([cause, count]) => ({ cause, count }));
  }, [machineData]);

  function cleanUnsupportedColors(doc) {
    const all = doc.querySelectorAll("*");

    all.forEach((el) => {
      const style = window.getComputedStyle(el);

      const props = [
        "color",
        "backgroundColor",
        "borderColor",
        "outlineColor",
        "textDecorationColor",
        "fill",
        "stroke",
      ];

      props.forEach((prop) => {
        const value = style[prop];

        if (value && value.includes("oklch")) {
          if (prop === "backgroundColor") {
            el.style.backgroundColor = "#ffffff";
          } else if (prop === "color") {
            el.style.color = "#0f172a";
          } else {
            el.style[prop] = "#e2e8f0";
          }
        }
      });

      el.style.boxShadow = "none";
    });
  }

  async function exportPDF() {
  try {
    const pdf = new jsPDF("p", "mm", "a4");

    let y = 15;

    // Title
    pdf.setFontSize(18);
    pdf.text("Machine Report", 10, y);

    y += 10;

    pdf.setFontSize(12);
    pdf.text(`Machine: ${machine.name}`, 10, y);
    y += 6;
    pdf.text(`Line: ${machine.line || "-"}`, 10, y);
    y += 6;
    pdf.text(`Technician: ${machine.technician || "-"}`, 10, y);
    y += 6;
    pdf.text(`Last Update: ${lastUpdate}`, 10, y);

    y += 10;

    // KPI
    pdf.setFontSize(14);
    pdf.text("KPIs", 10, y);
    y += 8;

    pdf.setFontSize(11);
    pdf.text(`Score moyen: ${machine.avgScore}/100`, 10, y);
    y += 6;
    pdf.text(`Downtime: ${machine.downtime} min`, 10, y);
    y += 6;
    pdf.text(`Tickets: ${machine.tickets}`, 10, y);
    y += 6;
    pdf.text(`High: ${machine.critical}`, 10, y);

    y += 10;

    // Table header
    pdf.setFontSize(13);
    pdf.text("Historique", 10, y);
    y += 8;

    pdf.setFontSize(10);
    pdf.text("Crit", 10, y);
    pdf.text("Score", 40, y);
    pdf.text("Down", 70, y);
    pdf.text("Cause", 100, y);

    y += 5;

    const machineData = data.filter((d) => d.Machine === machine.name);

    machineData.slice(0, 20).forEach((item) => {
      if (y > 270) {
        pdf.addPage();
        y = 10;
      }

      pdf.text(item.Criticite || "-", 10, y);
      pdf.text(String(item.Score), 40, y);
      pdf.text(String(item.Downtime_min), 70, y);
      pdf.text(item.Cause?.substring(0, 20) || "-", 100, y);

      y += 5;
    });

    y += 10;

    // Recommendation
    pdf.setFontSize(13);
    pdf.text("Recommendation", 10, y);

    y += 6;
    pdf.setFontSize(11);

    const rec =
      machine.last.Recommendation ||
      "Maintenance preventive recommandee.";

    const lines = pdf.splitTextToSize(rec, 180);
    pdf.text(lines, 10, y);

    pdf.save(`${machine.name}-report.pdf`);
  } catch (err) {
    console.error("PDF ERROR:", err);
    alert("PDF failed");
  }
}

  return (
    <div className="space-y-6">
      <div ref={reportRef} className="space-y-6  bg-slate-100 p-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <button
            onClick={onBack}
            type="button"
            className="no-print mb-4 flex items-center gap-2 rounded-xl border border-blue-600 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-slate-950">
                  {machine.name}
                </h1>
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
              className="no-print flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow hover:bg-blue-700"
            >
              <Download size={18} />
              Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <KpiCard
            title="Score Moyen"
            value={`${machine.avgScore}/100`}
            icon={<Gauge />}
          />
          <KpiCard
            title="Downtime Total"
            value={`${machine.downtime} min`}
            icon={<Wrench />}
          />
          <KpiCard
            title="Tickets Total"
            value={machine.tickets}
            icon={<Activity />}
          />
          <KpiCard
            title="High Priority"
            value={machine.critical}
            icon={<AlertTriangle />}
            danger
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:col-span-2">
            <h2 className="mb-4 text-lg font-black text-slate-950">
              Historique des décisions
            </h2>

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
                    <tr key={i} className="border-t border-slate-200">
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

          <ChartCard title="Analyse criticité">
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
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ChartCard title="Évolution du score">
            <LineChart data={machineData}>
              <XAxis dataKey="Ticket_ID" hide />
              <YAxis />
              <Tooltip />
              <Line dataKey="Score" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ChartCard>

          <ChartCard title="Downtime">
            <BarChart data={machineData}>
              <XAxis dataKey="Ticket_ID" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Downtime_min" fill="#2563eb" />
            </BarChart>
          </ChartCard>

          <ChartCard title="Causes fréquentes">
            <BarChart data={causeStats}>
              <XAxis dataKey="cause" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ChartCard>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-3 flex items-center gap-2">
            <Package className="text-blue-600" />
            <h2 className="text-lg font-black text-slate-950">
              Recommandation IA
            </h2>
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
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="mb-4 text-lg font-black text-slate-950">{title}</h2>

      <ResponsiveContainer width="100%" height={250}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}