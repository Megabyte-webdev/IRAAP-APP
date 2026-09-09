import { Bell, Check, ChevronRight } from "lucide-react";
import { useAuth } from "@/app/_context/AuthContext";

const formatNotificationTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const getNotificationTone = (type?: string) => {
  if (type?.includes("CHAT"))
    return "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300";
  if (type?.includes("SUPPORT"))
    return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300";
  if (type?.includes("ORGANIZATION") || type?.includes("ACCOUNT"))
    return "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-300";
  if (type?.includes("MEETING"))
    return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
};

const NotificationList = ({
  notificationCount,
  notifications,
  markAllRead,
  markRead,
  setShowNotifications,
}: any) => {
  const { refreshOrganizationContext } = useAuth();

  const openNotification = async (item: any) => {
    if (!item.readAt) markRead.mutate(item.id);
    setShowNotifications(false);

    const type = String(item.type || "").toUpperCase();
    const isOrganizationNotification = type.includes("ORGANIZATION");

    if (isOrganizationNotification) {
      await refreshOrganizationContext();
      window.location.assign("/organization");
      return;
    }

    if (item.link) window.location.assign(item.link);
  };

  return (
    <div className="fixed right-2 mt-3 w-[min(400px,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-[#172033]">
      <div className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Notifications
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {notificationCount
                  ? `${notificationCount} unread`
                  : "Everything is up to date"}
              </p>
            </div>
          </div>
          {notificationCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/5"
            >
              <Check size={13} />
              Mark all read
            </button>
          )}
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Bell size={20} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              You’re all caught up
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              New account, project, support and chat updates will appear here.
            </p>
          </div>
        ) : (
          notifications.map((item: any) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { void openNotification(item); }}
              className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 ${!item.readAt ? "bg-primary/[0.035]" : ""}`}
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold ${getNotificationTone(item.type)}`}
              >
                {(item.type || "N").slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span
                    className={`truncate text-sm ${!item.readAt ? "font-bold" : "font-semibold"} text-slate-900 dark:text-white`}
                  >
                    {item.title}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-400">
                    {formatNotificationTime(item.createdAt)}
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {item.message}
                </span>
                {item.link && (
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                    Open <ChevronRight size={12} />
                  </span>
                )}
              </span>
              {!item.readAt && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
            </button>
          ))
        )}
      </div>
      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900/30">
        <p className="text-[10px] text-slate-400">
          Notifications are kept in your IRAAP inbox so important updates are
          never lost.
        </p>
      </div>
    </div>
  );
};

export default NotificationList;
