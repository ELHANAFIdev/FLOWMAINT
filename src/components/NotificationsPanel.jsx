export default function NotificationsPanel({ notifications }) {
  return (
    <aside className="hidden w-80 shrink-0 border-l border-slate-200 bg-white p-6 xl:block">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-black">Notifications</h2>
          <p className="text-xs text-slate-400">Latest alerts</p>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          ● Live Data
        </span>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && (
          <p className="text-sm text-slate-500">Aucune notification critique.</p>
        )}

        {notifications.map((n, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex gap-3">
              <div
                className={`mt-1 h-3 w-3 rounded-full ${
                  n.Criticite === "critique" ? "bg-red-500" : "bg-orange-400"
                }`}
              />

              <div>
                <p className="text-sm font-bold">{n.Machine}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {n.Cause || n.Recommendation || "Maintenance requise"}
                </p>
                <p className="mt-2 text-xs font-semibold text-blue-600">
                  Score: {n.Score}% | Downtime: {n.Downtime_min} min
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}