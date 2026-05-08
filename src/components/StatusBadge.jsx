export default function StatusBadge({ value }) {
  const v = (value || "Non défini").toLowerCase();

  const isOk = v === "disponible" || v === "pieces_fournies" || v === "en stock" || v === "disponible";
  const isError = v === "non_disponible" || v === "bloque_attente_solution" || v === "rupture";

  const style = isOk
    ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
    : isError
    ? "bg-red-50 text-red-600 ring-red-100"
    : "bg-slate-50 text-slate-500 ring-slate-100";

  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset transition-colors ${style}`}>
      <span className={`mr-1.5 h-1 w-1 rounded-full ${isOk ? 'bg-emerald-500' : isError ? 'bg-red-500' : 'bg-slate-400'}`}></span>
      {v.replace("_", " ")}
    </span>
  );
}