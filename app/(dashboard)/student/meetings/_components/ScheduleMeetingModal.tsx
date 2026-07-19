"use client";

import { useState, useMemo } from "react";
import {
  X,
  Search,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { User } from "@/app/_utils/types";
import { websocket } from "@/app/_services/websocket";
import { useAuth } from "@/app/_context/AuthContext";

interface ScheduleMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (data: {
    user: User;
    title: string;
    description?: string;
    scheduledAt: string;
    duration: number;
  }) => void;
  users?: User[];
  isLoadingUsers?: boolean;
}

export default function ScheduleMeetingModal({
  open,
  onClose,
  users = [],
  isLoadingUsers = false,
  onSchedule,
}: ScheduleMeetingModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState("60");

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  const handleReset = () => {
    setSelectedUser(null);
    setSearchQuery("");
    setTitle("");
    setDescription("");
    setScheduledDate("");
    setScheduledTime("");
    setDuration("60");
    setError("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSchedule = async () => {
    setError("");

    // Validation
    if (!selectedUser) {
      setError("Please select a participant");
      return;
    }

    if (!title.trim()) {
      setError("Meeting title is required");
      return;
    }

    if (!scheduledDate) {
      setError("Please select a date");
      return;
    }

    if (!scheduledTime) {
      setError("Please select a time");
      return;
    }

    if (!duration || Number(duration) <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    try {
      setIsSubmitting(true);

      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (isNaN(dateTime.getTime())) {
        setError("Invalid date or time format");
        return;
      }

      const scheduledAt = dateTime.toISOString();

      onSchedule({
        user: selectedUser,
        title: title.trim(),
        description: description.trim() || undefined,
        scheduledAt,
        duration: Number(duration),
      });

      handleClose();
    } catch (err) {
      setError("Failed to schedule meeting. Please try again.");
      console.error("Schedule error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Schedule Meeting
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Invite a participant to a research sync
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* User Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-900">
              Select Participant
            </label>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* User List */}
            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/30">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-500">No users found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredUsers?.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchQuery("");
                      }}
                      className={`w-full px-3 py-3 text-left text-sm transition-colors ${
                        selectedUser?.id === user.id
                          ? "bg-blue-50 text-slate-900"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        {selectedUser?.id === user.id && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected User Display */}
          {selectedUser && (
            <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-3">
              <p className="text-xs text-slate-600">
                Inviting{" "}
                <span className="font-semibold">{selectedUser.fullName}</span>
              </p>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">
              Meeting Title
            </label>
            <input
              type="text"
              placeholder="e.g., Weekly Project Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">
              Description (Optional)
            </label>
            <textarea
              placeholder="Add agenda or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-900">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Time Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-900">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Duration Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">
              Duration (minutes)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
              <option value="150">2.5 hours</option>
              <option value="180">3 hours</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={isSubmitting || !selectedUser}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                Schedule Meeting
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
