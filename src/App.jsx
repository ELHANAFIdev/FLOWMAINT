import { useEffect, useMemo, useState } from "react";
import { getSheetData } from "./services/sheetApi";
import Layout from "./components/Layout";
import DashboardHome from "./components/DashboardHome";
import MachineDetails from "./components/MachineDetails";

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
          Decision_ID: findValue("Decision"),
          Timestamp: findValue("Timestamp"),
          Ticket_ID: findValue("Ticket"),
          Machine: findValue("Machine"),
          Line: findValue("Line"),
          Criticite: findValue("Criticité") || findValue("Crit"),
          Score: Number(findValue("Score") || 0),
          Downtime_min: Number(findValue("Downtime") || 0),
          Technician: findValue("Technician") || findValue("Techn"),
          Part_Needed: findValue("Part_Needed"),
          Part_Status:
            findValue("Part_Status") === "undefined"
              ? "Non défini"
              : findValue("Part_Status") || "Non défini",
          Stock_Status:
            findValue("Stock_Status") === "undefined"
              ? "Non défini"
              : findValue("Stock_Status") || "Non défini",
          Cause: findValue("Cause"),
          Recommendation: findValue("Recommendation") || findValue("Reco"),
          Next_Action: findValue("Next_Action") || findValue("Next"),
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

      if (item.Criticite === "critique") {
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
        d.Criticite === "critique" ||
        d.Criticite === "moyenne" ||
        d.Score >= 75 ||
        d.Part_Status === "non_disponible" ||
        d.Stock_Status === "bloque_attente_solution"
    )
    .slice(0, 8);

  return (
  <Layout notifications={notifications} page={page} setPage={setPage}>
    {selectedMachine ? (
      <MachineDetails
        machine={selectedMachine}
        data={data}
        lastUpdate={lastUpdate}
        onBack={() => setSelectedMachine(null)}
      />
    ) : (
      <DashboardHome
        data={data}
        machines={machines}
        lastUpdate={lastUpdate}
        loading={loading}
        page={page}
        onRefresh={loadData}
        onSelectMachine={setSelectedMachine}
      />
    )}
  </Layout>
);
}