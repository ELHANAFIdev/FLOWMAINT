import { useEffect, useMemo, useState } from "react";
import { getSheetData } from "./services/sheetApi";
import Layout from "./components/Layout";
import DashboardHome from "./components/DashboardHome";
import MachineDetails from "./components/MachineDetails";
import InterventionsTable from "./components/InterventionsTable";

export default function App() {
  const [data, setData] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("dashboard");

  async function loadData() {
    try {
      setLoading(true);
      const result = await getSheetData();

      const clean = result.map((row) => {
        const keys = Object.keys(row);

        const findValue = (name) => {
          const key = keys.find((k) =>
            k.toLowerCase().trim().includes(name.toLowerCase())
          );
          return key ? String(row[key] || "").trim() : "";
        };

        return {
          Decision_ID: findValue("intervention_id") || findValue("Decision"),
          Timestamp: findValue("updated_at") || findValue("Timestamp"),
          Ticket_ID: findValue("ticket_id") || findValue("Ticket"),
          Machine: findValue("machine_name") || findValue("Machine"),
          Line: findValue("Line") || "Ligne 1",
          Criticite: (() => {
            const v = (findValue("criticite") || findValue("Criticité") || findValue("Crit")).toLowerCase();
            if (v === "critique" || v === "high") return "high";
            if (v === "moyenne" || v === "medium") return "medium";
            if (v === "faible" || v === "low") return "low";
            return v || "low";
          })(),
          Score: Number(findValue("score_affectation") || findValue("Score") || 0),
          Downtime_min: Number(findValue("downtime_min") || findValue("Downtime") || 0),
          Technician: findValue("Technician") || findValue("Techn") || "Equipe Tech",
          Part_Needed: findValue("Part_Needed") || "Non spécifié",
          Part_Status:
            findValue("Part_Status") === "undefined"
              ? "Non défini"
              : findValue("Part_Status") || "Disponible",
          Stock_Status:
            findValue("Stock_Status") === "undefined"
              ? "Non défini"
              : findValue("Stock_Status") || "En stock",
          Cause: findValue("probable_cause") || findValue("Cause"),
          Recommendation: findValue("Recommendation") || findValue("Reco") || "Vérification standard",
          Next_Action: findValue("Next_Action") || findValue("Next") || "Suivi normal",
        };
      });

      setData(clean.filter((item) => item.Machine));
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error("Erreur loading sheet:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const machines = useMemo(() => {
    const map = {};

    data.forEach((item) => {
      if (!item.Machine) return;

      if (!map[item.Machine]) {
        map[item.Machine] = {
          name: item.Machine,
          tickets: 0,
          critical: 0,
          downtime: 0,
          score: 0,
          line: item.Line,
          technician: item.Technician,
          last: item,
          rows: [],
        };
      }

      map[item.Machine].tickets += 1;
      map[item.Machine].downtime += item.Downtime_min;
      map[item.Machine].score += item.Score;
      map[item.Machine].rows.push(item);

      if (item.Criticite === "high") {
        map[item.Machine].critical += 1;
      }

      map[item.Machine].last = item;
      map[item.Machine].line = item.Line;
      map[item.Machine].technician = item.Technician;
    });

    return Object.values(map).map((m) => ({
      ...m,
      avgScore: m.tickets ? Math.round(m.score / m.tickets) : 0,
    }));
  }, [data]);

  const notifications = data
    .filter(
      (d) =>
        d.Criticite === "high" ||
        d.Criticite === "medium" ||
        d.Score >= 75 ||
        d.Part_Status === "non_disponible" ||
        d.Stock_Status === "bloque_attente_solution"
    )
    .slice(0, 8);

  const renderContent = () => {
    if (selectedMachine) {
      return (
        <MachineDetails
          machine={selectedMachine}
          data={data}
          lastUpdate={lastUpdate}
          onBack={() => setSelectedMachine(null)}
        />
      );
    }

    switch (page) {
      case "dashboard":
        return (
          <DashboardHome
            data={data}
            machines={machines}
            lastUpdate={lastUpdate}
            loading={loading}
            page={page}
            onRefresh={loadData}
            onSelectMachine={setSelectedMachine}
          />
        );
      case "tickets":
      case "machines":
        return <InterventionsTable data={data} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <Activity size={48} className="mb-4 opacity-20" />
            <p className="text-xl font-bold">Page en cours de développement</p>
            <button 
              onClick={() => setPage("dashboard")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
            >
              Retour au Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <Layout notifications={notifications} page={page} setPage={setPage}>
      {renderContent()}
    </Layout>
  );
}