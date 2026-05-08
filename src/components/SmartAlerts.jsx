import { AlertTriangle, Gauge, PackageX } from "lucide-react";

export default function SmartAlerts({ data }) {
  const alerts = data
    .filter(
      (d) =>
        d.Criticite === "high" ||
        d.Score >= 75 ||
        d.Part_Status === "non_disponible" ||
        d.Stock_Status === "bloque_attente_solution"
    )
    .slice(0, 4);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl"></div>
      
      <div className="relative mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
            <h2 className="text-xl font-black tracking-tight">Diagnostic <span className="text-red-500">Intelligent</span></h2>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-400 text-slate-500">Alertes High Priority détectées par l'IA</p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-1.5 text-xs font-black text-red-500 ring-1 ring-red-500/50">
          <AlertTriangle size={14} />
          {alerts.length} ALERTS
        </div>
      </div>

      <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {alerts.map((a, i) => (
          <div key={i} className="group flex flex-col justify-between rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-lg bg-red-500/20 p-2 text-red-400 group-hover:scale-110 transition-transform">
                  {a.Part_Status === "non_disponible" ? (
                    <PackageX size={18} />
                  ) : (
                    <AlertTriangle size={18} />
                  )}
                </div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-tighter">Machine {a.Machine.substring(0, 6)}</div>
              </div>

              <h3 className="text-lg font-black text-white">{a.Machine}</h3>
              <p className="mt-1 text-xs font-medium text-slate-500">Cause probable: <span className="text-slate-300">{a.Cause || "Inconnue"}</span></p>

              <div className="mt-4 rounded-xl bg-slate-900/50 p-3 ring-1 ring-white/5">
                <p className="text-xs font-bold leading-relaxed text-slate-200">
                  {a.Next_Action || a.Recommendation || "Intervention immédiate requise"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-1.5">
                <Gauge size={14} className="text-blue-400" />
                <span className="text-xs font-black text-blue-400">Score {a.Score}%</span>
              </div>
              <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${a.Score}%` }}></div>
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-sm font-bold text-slate-500">Aucune anomalie High Priority détectée à cet instant.</p>
          </div>
        )}
      </div>
    </div>
  );
}