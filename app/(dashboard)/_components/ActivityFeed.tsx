"use client";

import { MessageSquare } from "lucide-react";

const ActivityFeed = ({ reviews, loading }: any) => {
  if (reviews.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-10 opacity-40">
        <MessageSquare size={32} className="mb-2" />
        <p className="text-xs font-medium">No activity yet</p>
      </div>
    );

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.75 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
      {reviews.map((rev: any) => (
        <div key={rev.id} className="relative flex items-start gap-3">
          {/* Timeline Dot */}
          <div className="absolute left-0 mt-1.5 w-5.5 h-5.5 flex items-center justify-center rounded-full bg-white border-2 border-slate-200 z-10">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          </div>
          <div className="ml-8">
            <p className="text-xs text-slate-700 font-medium leading-tight">
              {rev.summary}
            </p>
            <time className="text-[10px] text-slate-400 mt-1 block">
              {new Date(rev.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
