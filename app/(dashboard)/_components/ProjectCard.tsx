import {
  FileText,
  Calendar,
  User,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface ProjectProps {
  title: string;
  abstract: string;
  fileUrl: string;
  year: string;
  supervisor: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export function ProjectCard({
  title,
  abstract,
  fileUrl,
  year,
  supervisor,
  status,
}: ProjectProps) {
  const [imageError, setImageError] = useState(false);

  const statusConfig = {
    PENDING: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: "Pending Review",
    },
    APPROVED: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "Approved",
    },
    REJECTED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Returned",
    },
  };

  const statusStyle = statusConfig[status];

  // Handle Google Docs viewer URL safely
  const getViewerUrl = () => {
    try {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    } catch {
      return "#";
    }
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-gray-300">
      {/* Header with status and icon */}
      <div className="mb-4 flex items-start justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
        >
          {statusStyle.label}
        </span>
        <FileText
          size={20}
          className="text-gray-400 transition-colors group-hover:text-blue-600"
          aria-hidden="true"
        />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold leading-tight text-gray-900 line-clamp-2">
        {title}
      </h3>

      {/* Abstract */}
      <p className="mb-4 text-sm text-gray-600 line-clamp-3 leading-relaxed">
        {abstract}
      </p>

      {/* Metadata */}
      <div className="mt-auto space-y-2 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} className="shrink-0" aria-hidden="true" />
          <span className="truncate">Class of {year}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <User size={14} className="shrink-0" aria-hidden="true" />
          <span className="truncate">Supervisor: {supervisor}</span>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-4">
        {fileUrl ? (
          <a
            href={getViewerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span>Preview Document</span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        ) : (
          <button
            disabled
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            <AlertCircle size={14} aria-hidden="true" />
            <span>No document available</span>
          </button>
        )}
      </div>

      {/* Subtle decorative element */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </article>
  );
}
