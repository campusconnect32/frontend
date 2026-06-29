import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Send, Star, Check } from "lucide-react";

export default function NoteReviews() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [note, setNote] = useState(null);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    fetchNoteInfo();
    fetchMyRating();
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(pollRef.current);
  }, [noteId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchNoteInfo = async () => {
    try { const res = await api.get(`/notes/${noteId}`); setNote(res.data); } catch { navigate("/notes"); }
  };

  const fetchMyRating = async () => {
    try { const res = await api.get(`/notes/${noteId}/my-rating`); setRating(res.data.rating || 0); } catch {}
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/notes/${noteId}/reviews`);
      const all = res.data || [];
      setMessages(all.filter(m => m.comment && m.comment.trim() !== ""));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;
    setIsSending(true);
    setInputText("");
    try {
      await api.post(`/notes/${noteId}/reviews`, { rating: 0, comment: text });
      await fetchMessages();
    } catch (err) { toast.error("Failed to send message"); }
    finally { setIsSending(false); }
  };

  const handleRate = async (star) => {
    setRating(star);
    setSubmittingRating(true);
    try {
      await api.post(`/notes/${noteId}/reviews`, { rating: star, comment: "" });
      toast.success("Rating submitted!");
    } catch (err) { toast.error("Failed to submit rating"); }
    finally { setSubmittingRating(false); }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}`;
  };

  return (
    <div className="min-h-screen bg-[#EFEAE2]">
      <Navbar />
      <main className="max-w-2xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        <div className="bg-[#F0F2F5] border-b px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-200 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">📝</div>
          <div><h3 className="font-semibold text-sm text-gray-900">{note?.title || "Chat"}</h3><p className="text-xs text-gray-500">{messages.length} messages</p></div>
        </div>

        <div className="bg-white border-b px-4 py-2 flex items-center justify-center gap-1 flex-shrink-0">
          <span className="text-xs text-gray-500 mr-2">Rate this note:</span>
          {[1,2,3,4,5].map(star => (
            <button key={star} onClick={() => handleRate(star)} disabled={submittingRating} className="focus:outline-none">
              <Star className={`w-5 h-5 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1" style={{ backgroundImage: "url('data:image/png;base64,...')", backgroundColor: "#EFEAE2" }}>
          {loading ? <div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /></div> :
           messages.length === 0 ? <div className="flex items-center justify-center h-full text-center"><div><div className="text-4xl mb-3">💬</div><p className="text-sm text-gray-500">No messages yet</p></div></div> :
           messages.map((msg, idx) => {
             const isMe = msg.user_id === user?.user_id;
             const showAvatar = !isMe && (idx === 0 || messages[idx-1]?.user_id !== msg.user_id);
             return (
               <div key={msg.review_id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-1`}>
                 {!isMe && <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 mb-0.5">{showAvatar ? (msg.user_picture ? <img src={msg.user_picture} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{(msg.user_name||"?")[0]}</div>) : <div className="w-9 h-9" />}</div>}
                 <div className="max-w-[75%] group">
                   <div className="relative">
                     {!isMe && <div className="absolute top-0 -left-[6px] w-2 h-2 bg-white" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />}
                     {isMe && <div className="absolute bottom-0 -right-[6px] w-2 h-2 bg-[#005C4B]" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />}
                     <div className={`relative ${isMe ? "bg-[#005C4B] text-white rounded-lg rounded-br-sm" : "bg-white text-gray-900 rounded-lg rounded-tl-sm"} shadow-sm`}>
                       {!isMe && <p className="px-2.5 pt-1.5 pb-0 text-[11px] font-semibold text-[#005C4B]">{msg.user_name}</p>}
                       <div className={`${!isMe ? "px-2.5 pb-1.5 pt-0" : "px-2.5 py-1.5"} pr-16`}><p className="text-[14px] leading-[1.4] whitespace-pre-wrap break-words">{msg.comment}</p></div>
                       <div className={`absolute bottom-0.5 right-2 flex items-center gap-1 text-[10px] ${isMe ? "text-white/55" : "text-gray-400"}`}><span>{formatTime(msg.created_at)}</span>{isMe && <Check className="w-3 h-3" />}</div>
                     </div>
                   </div>
                 </div>
               </div>
             );
           })}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-[#F0F2F5] px-3 py-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key==="Enter" && handleSend()} placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-white rounded-full text-sm outline-none border-none" disabled={isSending} />
            <button onClick={handleSend} disabled={!inputText.trim() || isSending} className={`w-10 h-10 rounded-full flex items-center justify-center ${!inputText.trim() || isSending ? "bg-gray-300 text-gray-400" : "bg-[#005C4B] text-white"}`}>{isSending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}</button>
          </div>
        </div>
      </main>
    </div>
  );
}