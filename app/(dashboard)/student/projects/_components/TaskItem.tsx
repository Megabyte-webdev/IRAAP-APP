import { CheckCircle, Clock } from "lucide-react";

function TaskItem({ text, completed }: { text: string; completed: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        completed
          ? "bg-slate-50 dark:bg-slate-900/40 border-transparent"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      }`}
    >
      {completed ? (
        <CheckCircle
          size={16}
          className="text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0"
        />
      ) : (
        <Clock
          size={16}
          className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0"
        />
      )}

      <p
        className={`text-xs leading-relaxed ${
          completed
            ? "text-slate-500 dark:text-slate-400 line-through"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

export default TaskItem;
