export const SummaryCards = ({ summary }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-indigo-50 p-4 rounded-xl text-xs md:text-sm text-center shadow">
      <p className="text-sm text-slate-500">Total Records</p>
      <p className="text-xl font-bold text-indigo-700">{summary.total}</p>
    </div>
    <div className="bg-red-50 p-4 rounded-xl text-xs md:text-sm text-center shadow">
      <p className="text-sm text-slate-500">Duplicates Skipped</p>
      <p className="text-xl font-bold text-red-600">{summary.duplicates}</p>
    </div>
    <div className="bg-green-50 p-4 rounded-xl text-xs md:text-sm text-center shadow">
      <p className="text-sm text-slate-500">Ready for Import</p>
      <p className="text-xl font-bold text-green-700">{summary.ready}</p>
    </div>
  </div>
);
