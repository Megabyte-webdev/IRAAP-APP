export default function SidebarItem({ label, value, icon: Icon }: any) {
  return (
    <div className="flex gap-4">
      <div className="text-blue-400 mt-1">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-100 mt-0.5">
          {value || "Not Specified"}
        </p>
      </div>
    </div>
  );
}
