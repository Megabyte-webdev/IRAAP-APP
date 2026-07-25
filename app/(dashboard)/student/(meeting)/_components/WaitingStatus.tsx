import { Clock, UserCheck } from "lucide-react";

interface WaitingStatusProps {
  isWaitingForHost: boolean;
  waitingTime: number;
  isValidating: boolean;
  tokenLoading: boolean;
  isMediaSupported: boolean;
  error: string | null;
  onDismissError: () => void;
}

export default function WaitingStatus({
  isWaitingForHost,
  waitingTime,
  isValidating,
  tokenLoading,
  isMediaSupported,
  error,
  onDismissError,
}: WaitingStatusProps) {
  const formatWaitingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {isWaitingForHost && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <UserCheck className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700 font-medium">
              Waiting for host approval
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-yellow-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              Waiting for{" "}
              {waitingTime > 0 ? formatWaitingTime(waitingTime) : "0:00"}
            </span>
          </div>
          <p className="text-yellow-600 text-xs mt-2 text-center">
            The host has been notified of your request to join.
          </p>
        </div>
      )}

      {isValidating && !error && (
        <p className="mt-2 text-xs text-center text-[#2D3319]/60">
          Setting up your meeting…
        </p>
      )}

      {tokenLoading && !isWaitingForHost && (
        <p className="mt-2 text-xs text-center text-[#2D3319]/60">
          Getting your meeting ready…
        </p>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
          <p className="text-red-600 text-sm text-center">{error}</p>
          <div className="text-center">
            <button
              type="button"
              onClick={onDismissError}
              className="text-xs text-red-700 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {!isMediaSupported && (
        <p className="mt-1 text-[11px] text-center text-[#2D3319]/60">
          Tip: Chrome or Edge on desktop and the latest Chrome/Firefox on
          Android usually work best.
        </p>
      )}
    </div>
  );
}
