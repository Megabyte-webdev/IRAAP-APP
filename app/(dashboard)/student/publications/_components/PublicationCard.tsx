import { Publication } from "@/app/_utils/types";
import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
} from "lucide-react";
import { cn } from "@/app/_lib/utils";

const STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    label: "Pending Review",
    dotColor: "bg-amber-400",
    badgeColor:
      "bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200",
    message:
      "Your submission is under review. We typically respond within 5–7 business days.",
  },
  APPROVED: {
    icon: CheckCircle,
    label: "Approved",
    dotColor: "bg-emerald-500",
    badgeColor:
      "bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200",
    message:
      "Approved and published. Your work is now available in the research repository.",
  },
  REJECTED: {
    icon: XCircle,
    label: "Revision Needed",
    dotColor: "bg-red-500",
    badgeColor: "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200",
    message:
      "We've provided detailed feedback. Please review and resubmit your revised version.",
  },
};

interface PublicationCardProps {
  publication: Publication;
}

const PublicationCard = ({ publication }: PublicationCardProps) => {
  const status =
    STATUS_CONFIG[publication.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.PENDING;

  const StatusIcon = status.icon;

  const submittedDate = new Date(publication.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <article className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Main Content Area */}
      <div className="flex-1 px-5 py-4">
        {/* File Icon */}
        <div className="mb-3.5">
          <div className="inline-flex h-10 w-10 rounded-lg bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 items-center justify-center">
            <FileText
              size={20}
              className="text-slate-400 dark:text-slate-500"
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {publication.title}
        </h3>

        {/* Abstract */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
          {publication.abstract}
        </p>

        {/* Status Badge and Date */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", status.dotColor)} />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {status.label}
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-500">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-500">
            {submittedDate}
          </span>
        </div>
      </div>

      {/* Status Message Section */}
      <div
        className={cn(
          "px-5 py-3.5 border-t border-slate-100 dark:border-slate-800",
          status.badgeColor,
        )}
      >
        <div className="flex items-start gap-2.5">
          <div className="shrink-0 mt-0.5">
            <StatusIcon size={16} strokeWidth={2.5} />
          </div>
          <p className="text-xs font-medium leading-relaxed">
            {status.message}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
        <a
          href={publication.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm transition-colors duration-200"
          aria-label="Download PDF"
        >
          <FileText size={16} />
          <span>Download PDF</span>
        </a>
      </div>
    </article>
  );
};

export default PublicationCard;
