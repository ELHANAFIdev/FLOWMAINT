import { AlertTriangle, Gauge, PackageX } from "lucide-react";

export default function SmartAlerts({ data }) {
  const alerts = data
    .filter(
      (d) =>
        d.Criticite === "critique" ||
        d.Score >= 75 ||
        d.Part_Status === "non_disponible" ||
        d.Stock_Status === "bloque_attente_solution"
    )
    .slice(0, 4);

  return (
    <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">Smart Alerts</h2>
          <p className="text-sm text-slate-400">AI maintenance warnings</p>
        </div>

        <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold">
          {alerts.length} alertes
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {alerts.map((a, i) => (
          <div key={i} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
            <div className="mb-3 flex items-center gap-2 text-red-300">
              {a.Part_Status === "non_disponible" ? (
                <PackageX size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
              <span className="text-sm font-bold">{a.Machine}</span>
            </div>

            <p className="text-xs text-slate-300">Cause: {a.Cause || "-"}</p>

            <p className="mt-2 line-clamp-2 text-sm font-semibold">
              {a.Next_Action || a.Recommendation || "Intervention requise"}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <Gauge size={14} />
              Score: {a.Score}%
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <p className="text-sm text-slate-400">Aucune alerte intelligente.</p>
        )}
      </div>
    </div>
  );
}