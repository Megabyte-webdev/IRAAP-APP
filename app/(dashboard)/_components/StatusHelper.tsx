import { StatusBtnProps } from "@/app/_utils/types";
import { FC } from "react";

export function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-800">{value}</h3>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: "text-amber-600 bg-amber-50 border-amber-100",
    APPROVED: "text-green-600 bg-green-50 border-green-100",
    REJECTED: "text-red-600 bg-red-50 border-red-100",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-tight ${styles[status] || styles.PENDING}`}
    >
      {status}
    </span>
  );
}
export const StatusButton: FC<StatusBtnProps> = ({
  active,
  isCurrent,
  onClick,
  icon,
  label,
  activeClass,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
      active
        ? activeClass
        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
    }`}
  >
    <div className="flex items-center gap-3">
      <span
        className={active ? "scale-110 transition-transform" : "opacity-70"}
      >
        {icon}
      </span>
      {label}
    </div>

    {/*  Current Badge */}
    {isCurrent && (
      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
        Current
      </span>
    )}
  </button>
);

export const statusStyles: Record<string, string> = {
  APPROVED: "bg-green-100 text-green-600",
  PENDING: "bg-yellow-100 text-yellow-600",
  REJECTED: "bg-red-100 text-red-600",
  REVISION_REQUESTED: "bg-purple-100 text-purple-600",
};
