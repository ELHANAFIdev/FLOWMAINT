import Sidebar from "./Sidebar";
import NotificationsPanel from "./NotificationsPanel";

export default function Layout({ children, notifications = [], page, setPage }) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-100 text-slate-900">
      <Sidebar
        page={page}
        setPage={setPage}
        notificationsCount={notifications.length}
      />

      <main className="min-h-screen flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
        {children}
      </main>

      <NotificationsPanel notifications={notifications} />
    </div>
  );
}