"use client";

import { useState } from "react";
import { Check, X, FileText, User, ExternalLink } from "lucide-react";
import { usePublication } from "@/app/_hooks/use-publications";

export default function AdminPublicationsPage() {
  const { getPendingPublications, approvePublication, rejectPublication } =
    usePublication();

  const { data: publications = [], isLoading } = getPendingPublications();

  const [rejectingId, setRejectingId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading publication requests...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">
            Publication Approval
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Review and approve research submissions before publishing them to
            the public archive.
          </p>
        </header>

        {publications.length === 0 ? (
          <div
            className="
              bg-white
              border
              rounded-xl
              p-10
              text-center
            "
          >
            <FileText className="mx-auto text-slate-400" size={40} />

            <p className="mt-4 text-slate-500">
              No pending publication requests.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {publications.map((publication: any) => (
              <article
                key={publication.id}
                className="
                      bg-white
                      rounded-xl
                      border
                      p-6
                      shadow-sm
                    "
              >
                <div
                  className="
                      flex
                      justify-between
                      gap-4
                    "
                >
                  <div className="space-y-3">
                    <h2
                      className="
                          font-semibold
                          text-lg
                          text-slate-900
                        "
                    >
                      {publication.title}
                    </h2>

                    <p
                      className="
                          text-sm
                          text-slate-600
                        "
                    >
                      {publication.abstract}
                    </p>

                    <div
                      className="
                          flex
                          flex-wrap
                          gap-4
                          text-sm
                          text-slate-500
                        "
                    >
                      <span className="flex gap-2 items-center">
                        <User size={15} />
                        {publication.requester?.fullName ||
                          "Unknown researcher"}
                      </span>

                      {publication.project && (
                        <span>Linked Project: {publication.project.title}</span>
                      )}
                    </div>

                    <a
                      href={publication.fileUrl}
                      target="_blank"
                      className="
                            inline-flex
                            items-center
                            gap-2
                            text-blue-600
                            text-sm
                          "
                    >
                      <FileText size={16} />
                      View Document
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <div
                    className="
                        flex
                        flex-col
                        gap-3
                      "
                  >
                    <button
                      onClick={() => approvePublication.mutate(publication.id)}
                      disabled={approvePublication.isPending}
                      className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-lg
                            bg-green-600
                            text-white
                            text-sm
                            hover:bg-green-700
                          "
                    >
                      <Check size={16} />
                      Approve
                    </button>

                    <button
                      onClick={() => setRejectingId(publication.id)}
                      className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-lg
                            bg-red-600
                            text-white
                            text-sm
                            hover:bg-red-700
                          "
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
