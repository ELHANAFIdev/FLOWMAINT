import Sidebar from "./Sidebar";
import NotificationsPanel from "./NotificationsPanel";

export default function Layout({ children, notifications = [], page, setPage }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans">
      <Sidebar
        page={page}
        setPage={setPage}
        notificationsCount={notifications.length}
      />

      <main className="relative flex-1 overflow-y-auto px-6 py-8 md:px-10">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      <NotificationsPanel notifications={notifications} />
    </div>
  );
}