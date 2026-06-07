import SafeImage from "@/app/_components/SafeImage";
import { useChatUtils } from "@/app/_context/ChatContext";

interface UserImageProps {
  user: {
    id?: number | string;
    fullName: string;
    profile_pic?: { url?: string };
  };
  size?: number;
  style?: any;
  rounded?: string;
}

const UserImage = ({
  user,
  size = 36,
  style = {
    boxShadow:
      "0px 0px 2.03px 0.51px #00000040, 0.51px -3.05px 2.03px 1.52px #00000040 inset",
  },
  rounded = "rounded-xl",
}: UserImageProps) => {
  const { onlineUsers } = useChatUtils();

  // Set.has() — O(1) lookup, Number() handles both string and number ids
  const isOnline = !!user?.id && onlineUsers.has(Number(user.id));

  const initials = user?.fullName?.trim()?.slice(0, 2)?.toUpperCase() || "NA";

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`cursor-pointer relative shrink-0 border border-white bg-gray-100 ${rounded}`}
      style={{ ...style, width: size, height: size }}
    >
      {user?.profile_pic?.url ? (
        <SafeImage
          src={user.profile_pic.url}
          alt={user?.fullName}
          width={size}
          height={size}
          className={`w-full h-full object-cover ${rounded}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center bg-gray-100 font-semibold text-black ${rounded}`}
          style={{ width: size, height: size }}
        >
          {initials}
        </div>
      )}

      {isOnline && (
        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

export default UserImage;
