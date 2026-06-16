export default function ReviewBubble({ review }) {
  const time = new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-start mb-3">
      {/* User info (small avatar + name) */}
      <div className="flex items-center gap-2 mb-1 ml-2">
        <img
          src={review.user_picture || "https://via.placeholder.com/24"}
          alt=""
          className="w-5 h-5 rounded-full object-cover"
        />
        <span className="text-xs font-medium text-[#0F0F10]">{review.user_name}</span>
      </div>

      {/* Speech bubble with tail at top-left */}
      <div className="relative bg-[#F5F3EE] text-[#0F0F10] rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] shadow-sm border border-[#E7E5E0]">
        {/* Tail */}
        <div className="absolute -top-2 left-3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#F5F3EE]" />
        <div className="absolute -top-[9px] left-[11px] w-0 h-0 border-l-[7px] border-r-[7px] border-b-[9px] border-l-transparent border-r-transparent border-b-[#E7E5E0]" />

        {/* Rating stars */}
        <div className="flex gap-0.5 mb-1">
          {[1,2,3,4,5].map(star => (
            <svg
              key={star}
              className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.26 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.284-3.957z" />
            </svg>
          ))}
        </div>

        {/* Comment */}
        <p className="text-sm whitespace-pre-wrap break-words">{review.comment}</p>

        {/* Time */}
        <div className="text-right text-[10px] text-[#6B6B70] mt-1">{time}</div>
      </div>
    </div>
  );
}