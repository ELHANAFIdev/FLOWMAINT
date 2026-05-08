export default function KpiCard({ title, value, icon, danger, warning }) {
  const boxStyle = danger
    ? "bg-red-500 text-white shadow-red-200"
    : warning
    ? "bg-amber-500 text-white shadow-amber-200"
    : "bg-blue-600 text-white shadow-blue-200";

  return (
    <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-150"></div>
      
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <h2
            className={`mt-2 text-3xl font-black tracking-tight ${
              danger ? "text-red-600" : "text-slate-900"
            }`}
          >
            {value}
          </h2>
          <div className="mt-2 flex items-center gap-1">
            <div className={`h-1 w-8 rounded-full ${danger ? 'bg-red-200' : 'bg-blue-100'}`}></div>
            <div className={`h-1 w-2 rounded-full ${danger ? 'bg-red-500' : 'bg-blue-500'}`}></div>
          </div>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${boxStyle} transition-transform duration-500 group-hover:rotate-12`}>
          {icon}
        </div>
      </div>
    </div>
  );
}