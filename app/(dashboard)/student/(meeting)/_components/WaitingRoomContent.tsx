"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ChevronDown,
  ArrowRight,
  X,
} from "lucide-react";
import { validateMeeting } from "@/app/_lib/videosdk";
import { useMeetingContext } from "@/app/_context/MeetingProvider";
import { useMeeting, useMeetingPreview } from "@afosecure/meetingsdk";
import WaitingStatus from "./WaitingStatus";
import { useAuth } from "@/app/_context/AuthContext";

export default function WaitingRoomContent() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isWaitingForHost, setIsWaitingForHost] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);
  const [isMediaSupported, setIsMediaSupported] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Device Selection States
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const { authDetails } = useAuth();
  const userId = authDetails?.user.id;

  const {
    meetingId,
    meetingName,
    hostName,
    userName,
    isOpen,
    status,
    isMicOn,
    setIsMicOn,
    isVideoOn,
    setIsVideoOn,
    participantId,
    token,
    setMeetingInfo,
  } = useMeetingContext();

  const { room: preview } = useMeetingPreview(meetingId, userId ?? "");

  const meetingHook = useMeeting({
    onEntryResponded: ({ participantId, decision }) => {
      handleEntryResponse(participantId, decision);
    },
    onMeetingLeft: () => {
      setIsWaitingForHost(false);
    },
    onError: (sdkError) => {
      console.error("Meeting error:", sdkError);
      setIsWaitingForHost(false);
      setError(
        "We couldn't connect you to the meeting. Please check your internet connection and try again.",
      );
    },
  });

  useEffect(() => {
    if (!meetingId || !participantId) return;

    const runValidation = async () => {
      try {
        setIsValidating(true);
        const meeting = await validateMeeting(meetingId);

        if (!meeting) {
          setIsValidating(false);
          return;
        }

        const createdBy = meeting.created_by;
        const userIsHost = createdBy === participantId;
        setMeetingInfo({
          meetingName: meeting.name || meetingName,
          hostName: userIsHost ? "You" : meeting?.host_name || hostName,
          isOpen: meeting.is_open,
          meetingId: meeting.room_id,
        });
        setIsHost(userIsHost);
      } catch (err) {
        console.warn("Validation error (non-critical):", err);
      } finally {
        setIsValidating(false);
      }
    };

    runValidation();
  }, [meetingId, participantId]);

  const handleEntryResponse = (participantId: string, decision: string) => {
    if (decision === "approved") {
      setIsWaitingForHost(false);
      goToMeetingRoom();
    } else {
      setIsWaitingForHost(false);
      setError("The host declined your request to join this meeting.");
      meetingHook?.leave();
    }
  };

  const isTokenLoading = status === "loading";
  const joinDisabled =
    !meetingId || isJoining || isValidating || isWaitingForHost || !!error;

  useEffect(() => {
    let cancelled = false;
    let localStream: MediaStream | null = null;

    async function initMedia() {
      if (typeof window === "undefined") return;

      if (!navigator?.mediaDevices?.getUserMedia) {
        setIsMediaSupported(false);
        setError(
          "Your browser does not support camera and microphone access. You can still join the meeting without them.",
        );
        return;
      }

      setIsMediaSupported(true);

      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }

        localStream = s;
        setStream(s);

        const audioTrack = s.getAudioTracks()[0];
        const videoTrack = s.getVideoTracks()[0];

        if (audioTrack) audioTrack.enabled = true;
        if (videoTrack) videoTrack.enabled = true;

        setIsMicOn(!!audioTrack && audioTrack.enabled);
        setIsVideoOn(!!videoTrack && videoTrack.enabled);

        // Fetch list of devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter((d) => d.kind === "audioinput");
        const videoInputs = devices.filter((d) => d.kind === "videoinput");

        setAudioDevices(audioInputs);
        setVideoDevices(videoInputs);

        if (audioInputs.length > 0)
          setSelectedAudioDevice(audioInputs[0].deviceId);
        if (videoInputs.length > 0)
          setSelectedVideoDevice(videoInputs[0].deviceId);
      } catch (err: any) {
        console.error("getUserMedia error:", err);
        let message =
          "We couldn't access your camera and microphone. You can still join with them turned off.";
        if (err?.name === "NotAllowedError") {
          message = "Permission to use your camera or microphone was denied.";
        }
        setError(message);
        setIsMicOn(false);
        setIsVideoOn(false);
      }
    }

    initMedia();

    return () => {
      cancelled = true;
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [setIsMicOn, setIsVideoOn]);

  useEffect(() => {
    if (videoRef.current && stream && isVideoOn) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isVideoOn]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWaitingForHost) {
      interval = setInterval(() => {
        setWaitingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWaitingForHost]);

  const toggleMic = () => {
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    setIsMicOn(audioTrack.enabled);
  };

  const toggleVideo = () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOn(videoTrack.enabled);
  };

  const goToMeetingRoom = () => {
    if (!meetingId) {
      setError("We couldn't find this meeting. The link may be invalid.");
      return;
    }

    setIsJoining(true);
    const params = new URLSearchParams({
      meetingName,
      hostName,
      userName,
      meetingId,
    }).toString();

    router.push(`room/${encodeURIComponent(meetingId)}?${params}`);
  };

  const requestToJoin = async () => {
    if (!meetingId || !token) {
      setError("Meeting information is missing or incomplete.");
      return;
    }

    if (!meetingHook) {
      setError("Unable to connect to the meeting service. Please try again.");
      return;
    }

    try {
      setIsWaitingForHost(true);
      setWaitingTime(0);
      setError(null);
      await meetingHook.join({ roomId: meetingId, name: userName });
    } catch (err) {
      console.error("Failed to request join:", err);
      setError(
        "We couldn't send your join request. Please check your connection and try again.",
      );
      setIsWaitingForHost(false);
    }
  };

  const cancelJoinRequest = () => {
    setIsWaitingForHost(false);
    setWaitingTime(0);
    if (meetingHook?.room) {
      meetingHook.leave();
    }
  };

  const handleJoinClick = async () => {
    if (isHost) {
      goToMeetingRoom();
      return;
    }

    if (isWaitingForHost) return;

    if (isOpen) {
      try {
        setIsJoining(true);
        await meetingHook?.join({
          roomId: meetingId!,
          name: userName,
        });
        goToMeetingRoom();
      } catch (err) {
        setError("Unable to join the meeting. Please try again.");
        setIsJoining(false);
      }
      return;
    }

    requestToJoin();
  };

  return (
    <div className="w-full max-w-155 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Header Details */}
      <div className="mb-6 text-left">
        <span className="text-[#3DA9EC] text-xs font-semibold uppercase tracking-wider">
          UPCOMING CONSULTATION
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {meetingName || "Chapter 3 Architecture Review"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Supervisor:{" "}
          <span className="font-medium text-gray-700">{hostName || ""}</span> •
          Duration: 30 mins
        </p>
      </div>

      {/* Video Preview Container */}
      <div className="relative w-full aspect-video bg-[#4A4D4E] rounded-xl overflow-hidden flex items-center justify-center">
        {isVideoOn && stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300 gap-2">
            <VideoOff className="w-10 h-10 stroke-[1.5]" />
            <span className="text-sm font-medium text-gray-300">
              Camera is off
            </span>
          </div>
        )}

        {/* Video Overlay Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          {/* Audio Status Pill */}
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-full bg-[#22C55E] rounded-full animate-pulse"></span>
              <span className="w-0.5 h-2/3 bg-[#22C55E] rounded-full"></span>
              <span className="w-0.5 h-4/5 bg-[#22C55E] rounded-full"></span>
            </span>
            <span className="text-xs text-white font-medium">Mic working</span>
          </div>
          {/* Toggle Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full transition-colors ${
                isMicOn
                  ? "bg-black/60 hover:bg-black/80 text-white"
                  : "bg-[#EF4444] text-white hover:bg-red-600"
              }`}
            >
              {isMicOn ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoOn
                  ? "bg-black/60 hover:bg-black/80 text-white"
                  : "bg-[#EF4444] text-white hover:bg-red-600"
              }`}
            >
              {isVideoOn ? (
                <Video className="w-5 h-5" />
              ) : (
                <VideoOff className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="w-22.5"></div> {/* Spacer balance */}
        </div>
      </div>

      {/* Media Device Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            Microphone
          </label>
          <div className="relative">
            <select
              value={selectedAudioDevice}
              onChange={(e) => setSelectedAudioDevice(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-700 font-medium focus:outline-none focus:border-[#3DA9EC]"
            >
              {audioDevices.length > 0 ? (
                audioDevices.map((device, idx) => (
                  <option key={device.deviceId || idx} value={device.deviceId}>
                    {device.label || `Default - Audio Device ${idx + 1}`}
                  </option>
                ))
              ) : (
                <option value="">Default - MacBook Pro Mic</option>
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            Camera
          </label>
          <div className="relative">
            <select
              value={selectedVideoDevice}
              onChange={(e) => setSelectedVideoDevice(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-700 font-medium focus:outline-none focus:border-[#3DA9EC]"
            >
              {videoDevices.length > 0 ? (
                videoDevices.map((device, idx) => (
                  <option key={device.deviceId || idx} value={device.deviceId}>
                    {device.label || `FaceTime HD Camera`}
                  </option>
                ))
              ) : (
                <option value="">FaceTime HD Camera</option>
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Async Status Feedback */}
      <WaitingStatus
        isWaitingForHost={isWaitingForHost}
        waitingTime={waitingTime}
        isValidating={isValidating}
        tokenLoading={isTokenLoading}
        isMediaSupported={isMediaSupported}
        error={error}
        onDismissError={() => setError(null)}
      />

      <hr className="my-4 border-gray-100" />

      {/* Main Join CTA */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleJoinClick}
          disabled={joinDisabled}
          className={`cursor-pointer px-6 py-3 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
            joinDisabled
              ? "bg-[#3DA9EC]/50 cursor-not-allowed"
              : "bg-[#3DA9EC] hover:bg-[#3298d6]"
          }`}
        >
          <span>
            {isWaitingForHost
              ? "Waiting for Host Approval..."
              : isJoining
                ? "Joining meeting..."
                : isTokenLoading
                  ? "Preparing meeting..."
                  : isHost
                    ? "Start Meeting"
                    : preview?.canJoin || isOpen
                      ? "Join Meeting"
                      : "Join Waiting Room"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Cancel Request Button */}
        {isWaitingForHost && (
          <button
            onClick={cancelJoinRequest}
            className="mt-3 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel Request</span>
          </button>
        )}
      </div>
    </div>
  );
}
