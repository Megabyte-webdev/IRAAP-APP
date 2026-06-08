import { CheckCircle, Clock } from "lucide-react";

function TaskItem({ text, completed }: { text: string; completed: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${
        completed ? "bg-slate-50" : "bg-white border-slate-200"
      }`}
    >
      {completed ? (
        <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
      ) : (
        <Clock size={16} className="text-slate-400 mt-0.5" />
      )}

      <p
        className={`text-xs ${
          completed ? "text-slate-500 line-through" : "text-slate-700"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

export default TaskItem;
