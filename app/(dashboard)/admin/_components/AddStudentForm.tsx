import React from "react";
import { UserPlus } from "lucide-react";

export const AddStudentForm = ({ newStudent, setNewStudent, onAdd }: any) => (
  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 ml-1">
          Last Name
        </label>
        <input
          type="text"
          placeholder="e.g. Smith"
          value={newStudent.lastname}
          onChange={(e) =>
            setNewStudent({ ...newStudent, lastname: e.target.value })
          }
          className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 ml-1">
          First Name
        </label>
        <input
          type="text"
          placeholder="e.g. Jane"
          value={newStudent.firstname}
          onChange={(e) =>
            setNewStudent({ ...newStudent, firstname: e.target.value })
          }
          className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 ml-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="jane.smith@example.com"
          value={newStudent.email}
          onChange={(e) =>
            setNewStudent({ ...newStudent, email: e.target.value })
          }
          className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
        />
      </div>
      <div className="flex items-end">
        <button
          onClick={() => onAdd(newStudent)}
          className="w-full h-[42px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <UserPlus size={18} />
          <span>Add Student</span>
        </button>
      </div>
    </div>
  </div>
);
