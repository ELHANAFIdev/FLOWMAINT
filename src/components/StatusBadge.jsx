export default function StatusBadge({ value }) {
  const v = value || "Non défini";

  const style =
    v === "disponible" || v === "pieces_fournies"
      ? "bg-emerald-100 text-emerald-700"
      : v === "non_disponible" || v === "bloque_attente_solution"
      ? "bg-red-100 text-red-700"
      : "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${style}`}>
      {v}
    </span>
  );
}