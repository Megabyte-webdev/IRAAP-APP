"use client";

export default function TaskModal({ task, version, onClose, actions }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[600px] p-6 rounded-lg">
        <h2 className="text-lg font-bold">{task.title}</h2>

        <p className="text-sm mt-2">{task.description}</p>

        <div className="mt-4 text-xs text-slate-500">
          Status: {version?.status}
        </div>

        <div className="flex gap-2 mt-6">
          {version?.status === "DRAFT" && (
            <button
              onClick={() => actions.submitVersion.mutate(version.id)}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          )}

          {version?.status === "SUBMITTED" && (
            <>
              <button
                onClick={() => actions.approveVersion.mutate(version.id)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Approve
              </button>

              <button
                onClick={() => actions.rejectVersion.mutate(version.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </>
          )}

          {version?.status === "REJECTED" && (
            <button
              onClick={() => actions.recallVersion.mutate(version.id)}
              className="px-3 py-1 bg-indigo-600 text-white rounded"
            >
              Edit Again
            </button>
          )}

          <button onClick={onClose} className="ml-auto text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
