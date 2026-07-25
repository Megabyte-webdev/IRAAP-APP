interface RoundControlButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  size?: "small" | "medium";
  title?: string;
  className?: string;
}

export function RoundControlButton({
  children,
  active = false,
  onClick,
  size = "medium",
  title = "",
  className = "",
}: RoundControlButtonProps) {
  const dimensions = size === "small" ? "w-8 h-8" : "w-10 h-10";

  return (
    <button
      onClick={onClick}
      className={`
        ${dimensions} rounded-full flex items-center justify-center transition-all duration-200 shrink-0 outline-none
        ${
          active
            ? "bg-[#EBF6FD] text-[#121316] shadow-sm hover:bg-[#d8edfa]"
            : "bg-[#25282e] hover:bg-[#2f333a] text-gray-200 border border-white/10"
        }
        ${className}
      `}
      title={title}
    >
      {children}
    </button>
  );
}

export default RoundControlButton;
