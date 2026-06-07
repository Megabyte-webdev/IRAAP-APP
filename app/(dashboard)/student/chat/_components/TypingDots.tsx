const TypingDots = () => {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.1s]" />
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
    </div>
  );
};

export default TypingDots;
