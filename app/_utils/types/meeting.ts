export type Props = {
  meetingName: string;
};

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isYou: boolean;
  muted: boolean;
  videoOn?: boolean;
  stream?: MediaStream;
  connection?: boolean; // Video SDK connection object
}

export interface MeetingState {
  meetingId: string;
  meetingName: string;
  participants: Participant[];
  localParticipant: Participant | null;
  isMeetingJoined: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  activeSpeakerId: string | null;
}

export type MeetingAction =
  | { type: "SET_MEETING"; payload: { meetingId: string; meetingName: string } }
  | { type: "JOIN_MEETING" }
  | { type: "LEAVE_MEETING" }
  | { type: "TOGGLE_MIC" }
  | { type: "TOGGLE_CAMERA" }
  | { type: "ADD_PARTICIPANT"; payload: Participant }
  | { type: "REMOVE_PARTICIPANT"; payload: string }
  | {
      type: "UPDATE_PARTICIPANT";
      payload: { id: string; updates: Partial<Participant> };
    }
  | { type: "SET_ACTIVE_SPEAKER"; payload: string | null };

export interface ChatMessage {
  id: string;
  name: string;
  text: string;
  timestamp: string;
  senderId: string;
  senderName: string;
}
export interface MessageObject {
  id?: string;
  name?: string;
  text?: string;
  message?: string;
  timestamp?: string;
}

export interface RightPanelProps {
  setActiveTab: (tab: "chat" | "participants") => void;
  activeTab: "chat" | "participants";
  toggleSidebar: () => void;
  showSidebar: boolean;
  onUnreadChange: (count: number) => void;
  isChatOpen: boolean;
}

export type JoinMeetingProps = {
  searchParams?: {
    meetingId?: string;
    userName?: string;
  };
};

export interface CreateMeetingParams {
  title: string;
  created_by: string;
  is_open?: boolean;
}
