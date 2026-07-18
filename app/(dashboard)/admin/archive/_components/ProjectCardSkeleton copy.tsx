export default function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 animate-pulse">
      <div className="space-y-4">
        {/* Title Skeleton */}
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />

        {/* Description Skeletons */}
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />

        {/* Tag / Badge Skeletons */}
        <div className="flex gap-2 mt-4">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-20" />
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}
