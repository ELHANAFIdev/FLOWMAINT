export default function Badge({ value }) {
  const v = value || "-";

  const style =
    v === "critique"
      ? "bg-red-100 text-red-700 ring-red-200"
      : v === "moyenne"
      ? "bg-orange-100 text-orange-700 ring-orange-200"
      : v === "faible"
      ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
      : "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${style}`}>
      {v}
    </span>
  );
}