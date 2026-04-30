export default function KpiCard({ title, value, icon, danger, warning }) {
  const boxStyle = danger
    ? "bg-red-50 text-red-600"
    : warning
    ? "bg-orange-50 text-orange-600"
    : "bg-blue-50 text-blue-600";

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2
            className={`mt-2 text-3xl font-black ${
              danger ? "text-red-600" : "text-slate-900"
            }`}
          >
            {value}
          </h2>
        </div>

        <div className={`rounded-2xl p-3 ${boxStyle}`}>{icon}</div>
      </div>
    </div>
  );
}