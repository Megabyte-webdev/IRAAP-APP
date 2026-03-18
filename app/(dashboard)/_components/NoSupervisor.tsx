import { AlertCircle, UserCheck } from "lucide-react";
import Link from "next/link";

const NoSupervisor = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col items-center text-center space-y-6 mt-12">
      <div className="p-4 bg-amber-50 rounded-full text-amber-600">
        <AlertCircle size={48} />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">
          Supervisor Required
        </h1>
        <p className="text-slate-500">
          You cannot upload a project until you have been assigned a supervisor.
          Please contact the administrator or update your profile settings.
        </p>
      </div>

      <Link
        href="/student/settings"
        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
      >
        <UserCheck size={18} />
        Go to Settings
      </Link>
    </div>
  );
};

export default NoSupervisor;
