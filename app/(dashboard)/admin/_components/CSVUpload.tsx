import React from "react";

export const CSVUpload = ({ onUpload }: any) => (
  <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
    <input type="file" accept=".csv" className="hidden" onChange={onUpload} />
    <p className="font-bold text-slate-700">Upload CSV</p>
    <p className="text-xs text-slate-400 mt-1">
      lastname, firstname, email columns required
    </p>
  </label>
);
