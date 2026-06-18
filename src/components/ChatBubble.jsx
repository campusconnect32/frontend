export default function ChatBubble({ message, isOwn }) {
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`relative max-w-[80%] px-3 py-2 text-sm shadow-sm border ${
          isOwn
            ? 'bg-purple-600 text-white border-purple-600 rounded-lg rounded-tr-none'
            : 'bg-[#F5F3EE] text-[#0F0F10] border-[#E7E5E0] rounded-lg rounded-tl-none'
        }`}
      >
        {/* Tail */}
        {isOwn ? (
          <>
            <div className="absolute -top-2 right-3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-purple-600" />
            <div className="absolute -top-[9px] right-[11px] w-0 h-0 border-l-[7px] border-r-[7px] border-b-[9px] border-l-transparent border-r-transparent border-b-purple-600" />
          </>
        ) : (
          <>
            <div className="absolute -top-2 left-3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#F5F3EE]" />
            <div className="absolute -top-[9px] left-[11px] w-0 h-0 border-l-[7px] border-r-[7px] border-b-[9px] border-l-transparent border-r-transparent border-b-[#E7E5E0]" />
          </>
        )}

        {/* Sender name (only for incoming) */}
        {!isOwn && (
          <div className="flex items-center gap-1 mb-1">
            <img
              src={message.user_picture || "https://via.placeholder.com/16"}
              alt=""
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-[10px] font-medium text-[#0F0F10]">{message.user_name}</span>
          </div>
        )}

        <p className="whitespace-pre-wrap break-words">{message.comment}</p>
        <div className={`text-[10px] mt-1 ${isOwn ? 'text-purple-200' : 'text-[#6B6B70]'} text-right`}>{time}</div>
      </div>
    </div>
  );
}