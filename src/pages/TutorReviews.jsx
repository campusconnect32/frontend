import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Send, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ChatBubble from "@/components/ChatBubble";

export default function TutorReviews() {
  const { tutorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [tutor, setTutor] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchTutorInfo();
    fetchMessages();
  }, [tutorId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTutorInfo = async () => {
    try {
      const res = await api.get(`/tutors/${tutorId}`);
      setTutor(res.data);
    } catch (err) {
      toast.error("Tutor not found");
      navigate("/tutors");
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tutors/${tutorId}/reviews`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      await api.post(`/tutors/${tutorId}/reviews`, { rating: 0, comment: comment.trim() });
      setComment("");
      fetchMessages();
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleRate = async (star) => {
    setRating(star);
    setSubmittingRating(true);
    try {
      await api.post(`/tutors/${tutorId}/reviews`, { rating: star, comment: "" });
      toast.success("Rating submitted!");
    } catch (err) {
      toast.error("Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="neo-btn neo-btn-ghost">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          {tutor && <h2 className="font-semibold text-lg">{tutor.title}</h2>}
          <div /> {/* spacer */}
        </div>

        {/* Rating Bar (fixed at top) */}
        <div className="bg-white border border-[#E7E5E0] rounded-xl p-3 flex items-center justify-center gap-1 mb-4">
          <span className="text-xs text-[#6B6B70] mr-2">Rate this tutor:</span>
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              disabled={submittingRating}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            </button>
          ))}
          {submittingRating && <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin ml-2" />}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto mb-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-[#6B6B70] py-8">No messages yet. Start the conversation!</p>
          ) : (
            messages.map(msg => (
              <ChatBubble key={msg.review_id} message={msg} isOwn={msg.user_id === user?.user_id} />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        {user && (
          <form onSubmit={handleSendComment} className="flex items-center gap-2">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Type a message..."
              className="neo-input flex-1"
            />
            <button type="submit" disabled={sending || !comment.trim()} className="neo-btn bg-purple-600 border-purple-600 !px-4 !py-2">
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}