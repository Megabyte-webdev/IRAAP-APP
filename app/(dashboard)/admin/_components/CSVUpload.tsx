import React from "react";
import { UploadCloud, FileType } from "lucide-react";

export const CSVUpload = ({ onUpload }: any) => (
  <label className="relative group cursor-pointer">
    <input type="file" accept=".csv" className="hidden" onChange={onUpload} />
    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-white group-hover:border-indigo-400 group-hover:bg-indigo-50/50 transition-all duration-300">
      {/* Icon Circle */}
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
        <UploadCloud
          className="text-slate-400 group-hover:text-indigo-600"
          size={32}
        />
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-slate-700">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-slate-400 mt-1">
          CSV files only (Max. 10MB)
        </p>
      </div>

      {/* Badge for requirements */}
      <div className="mt-6 flex items-center justify-center w-max gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-[11px] font-medium text-slate-500">
        <FileType size={14} />
        <span>Required: firstname, lastname, email</span>
      </div>
    </div>
  </label>
);
