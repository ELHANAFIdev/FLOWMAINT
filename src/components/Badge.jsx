export default function Badge({ value }) {
  const v = (value || "-").toLowerCase();

  const style =
    v === "high"
      ? "bg-red-500 text-white shadow-red-100"
      : v === "medium"
      ? "bg-amber-500 text-white shadow-amber-100"
      : v === "low"
      ? "bg-emerald-500 text-white shadow-emerald-100"
      : "bg-slate-500 text-white shadow-slate-100";

  const label = v === "high" ? "High" : v === "medium" ? "Medium" : v === "low" ? "Low" : v;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm transition-all hover:scale-105 ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
      {label}
    </span>
  );
}