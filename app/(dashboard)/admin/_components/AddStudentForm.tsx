import React from "react";
import { UserPlus, GraduationCap } from "lucide-react";

export const AddStudentForm = ({ type, newData, setNewData, onAdd }: any) => {
  const isStudent = type === "STUDENT";
  // Select icon based on type: UserPlus for students, GraduationCap for supervisors
  const ButtonIcon = isStudent ? UserPlus : GraduationCap;

  return (
    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Last Name Field */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 ml-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="e.g. Smith"
            value={newData?.lastname || ""}
            onChange={(e) =>
              setNewData({ ...newData, lastname: e.target.value })
            }
            className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        {/* First Name Field */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 ml-1">
            First Name
          </label>
          <input
            type="text"
            placeholder="e.g. Jane"
            value={newData?.firstname || ""}
            onChange={(e) =>
              setNewData({ ...newData, firstname: e.target.value })
            }
            className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 ml-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="jane.smith@example.com"
            value={newData?.email || ""}
            onChange={(e) => setNewData({ ...newData, email: e.target.value })}
            className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => onAdd(newData)}
            className="w-full h-10.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <ButtonIcon size={18} />
            <span className="capitalize">Add {type.toLowerCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
