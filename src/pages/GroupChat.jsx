import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Send, Check, ImagePlus, X } from "lucide-react";

export default function GroupChat() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [group, setGroup] = useState(null);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);
  const [imageToSend, setImageToSend] = useState("");

  useEffect(() => {
    fetchGroupInfo();
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(pollRef.current);
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchGroupInfo = async () => {
    try {
      const res = await api.get(`/social/groups?search=${encodeURIComponent("")}`); // Hack: get all and find
      // Actually we have a dedicated endpoint – we can get group via members or all list
      // For simplicity, we fetch from all groups and filter
      const all = (await api.get("/social/groups")).data || [];
      const g = all.find(g => g.group_id === groupId);
      if (!g) throw new Error("Not found");
      setGroup(g);
    } catch { navigate("/social"); }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/social/groups/${groupId}/messages`);
      setMessages(res.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !imageToSend) || isSending) return;
    setIsSending(true);
    try {
      await api.post(`/social/groups/${groupId}/messages`, {
        content: inputText.trim(),
        image: imageToSend,
        reply_to_id: replyTo?.message_id || null
      });
      setInputText("");
      setImageToSend("");
      setReplyTo(null);
      fetchMessages();
    } catch (err) { toast.error("Failed to send"); }
    finally { setIsSending(false); }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  };

  return (
    <div className="min-h-screen bg-[#EFEAE2]">
      <Navbar />
      <main className="max-w-2xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        <div className="bg-[#F0F2F5] border-b px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => navigate("/social")} className="p-1 hover:bg-gray-200 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">💬</div>
          <div><h3 className="font-semibold text-sm">{group?.name || "Group"}</h3><p className="text-xs text-gray-500">{messages.length} messages</p></div>
        </div>

        {/* Messages (same structure as ClubChat) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1" style={{ backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAWdEVYdFRpdGxlAEJlYWNvbi5qcGVnQ1JFV0EAAAKsSURBVGiB7ZpNjtQwEEa/4gTsOUJvOEJL4gJIiAuw5QhICFbsWMI1eo4GCdHdLjtJ2amfqspf8j5p1Op2+XPZVU4nKVlZeZKkOyLiKiI+IuI2Ij4j4nO59j9K1j7LelzW5+8REWtE/FnLD7oHWDtrr8AJcDa5Tw/gj61qEwhsflK9v0TEr2WMfx7gI1X7+q4JTG/eAx4YcJvALIHpvUZEO0dawIAXX8AD4G0CC4DXSZnNA74D3MqvteCcIQ7MUzScC3JDHwHuD+B9JqwBfKMxluMALnrA+0w4MRbGcfQwBnj2BHBfB3xPwtqLfMw81tLyGBCdAW+JcDKhvYX07C5yP0/9FuvB1QSYkwlrI9BYTqjGJmGgKox7gB8RtXACsN6BngMME4BXmq8C/BmTi/wA/FyLtjEDcPx7x74E8GHyHlMP8Gj8jR7gLOLfFWCdk3gNuPzJQVa/wt1rsc8M0O3b1gSQTqMmz9QO03dk8YQlMl+R/jXLBFss9tFrwCev78xzGpv5crtQ6++zTP+O0s1t7oGL/jkP9OmfgF5u1S7ujC+QLx4bICJE4P3bIwFfvGVdGeLDM54C7t/PbwgAPuRMNYUx9xR1QdSsyCk8FgzC4wD3zPAVOORkzty2AM6BdY6BzM84oow0S3mAC8BJcTTjTwfwGfBm3KoCbsazHeBTD7ifP93iHSDdby8O8K4PeIAcnbuqAY4C4wFf2IAXDa5rnhp5nYHh+fOBTX9sg80iS1d1zxK7M1r8H9m96PJd7W2lBD5OudmlJdAc1+oLk/bNyOXrLNo4EONIvgCu83I0OpxMboGDJvXH2sUGNwuTBNzO8Vqz+4K/AYynffDA3GlvAAAAAElFTkSuQmCC')", backgroundColor: "#EFEAE2" }}>
          {loading ? <div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /></div> :
           messages.length === 0 ? <div className="flex items-center justify-center h-full text-center"><div><div className="text-4xl mb-3">💬</div><p className="text-sm text-gray-500">No messages yet</p></div></div> :
           messages.map((msg, idx) => {
             const isMe = msg.sender_id === user?.user_id;
             const showAvatar = !isMe && (idx === 0 || messages[idx-1]?.sender_id !== msg.sender_id);
             return (
               <div key={msg.message_id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-1`}>
                 {!isMe && <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 mb-0.5">{showAvatar ? (msg.sender_picture ? <img src={msg.sender_picture} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{(msg.sender_name||"?")[0]}</div>) : <div className="w-9 h-9" />}</div>}
                 <div className="max-w-[75%] group">
                   {msg.reply_to && (
                     <div className={`mb-0.5 px-2 py-1 rounded-t-lg text-[11px] ${isMe ? "bg-[#025144]/30 text-white/90" : "bg-gray-200/80 text-gray-600"}`}>
                       <span className="font-medium">{msg.reply_to.sender_name}</span>
                       <p className="truncate opacity-80">{msg.reply_to.content?.substring(0, 100)}</p>
                     </div>
                   )}
                   <div className="relative">
                     {!isMe && <div className="absolute top-0 -left-[6px] w-2 h-2 bg-white" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />}
                     {isMe && <div className="absolute bottom-0 -right-[6px] w-2 h-2 bg-[#005C4B]" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />}
                     <div className={`relative ${isMe ? "bg-[#005C4B] text-white rounded-lg rounded-br-sm" : "bg-white text-gray-900 rounded-lg rounded-tl-sm"} shadow-sm`}>
                       {!isMe && <p className="px-2.5 pt-1.5 pb-0 text-[11px] font-semibold text-[#005C4B]">{msg.sender_name}</p>}
                       {msg.image && <img src={msg.image} alt="" className="w-full max-h-60 object-cover rounded-lg mb-1" />}
                       {msg.content && <div className={`${!isMe ? "px-2.5 pb-1.5 pt-0" : "px-2.5 py-1.5"} pr-16`}><p className="text-[14px] leading-[1.4] whitespace-pre-wrap break-words">{msg.content}</p></div>}
                       <div className={`absolute bottom-0.5 right-2 flex items-center gap-1 text-[10px] ${isMe ? "text-white/55" : "text-gray-400"}`}>
                         <button onClick={() => setReplyTo(msg)} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white mr-0.5">↩</button>
                         <span>{formatTime(msg.created_at)}</span>
                         {isMe && <Check className="w-3 h-3" />}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             );
           })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        {replyTo && (
          <div className="bg-[#F0F2F5] border-t px-4 py-2 flex items-center gap-3 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#005C4B]">Replying to {replyTo.sender_name}</p>
              <p className="text-xs text-gray-500 truncate">{replyTo.content?.substring(0, 50)}</p>
            </div>
            <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-gray-200 rounded"><X className="w-4 h-4 text-gray-500" /></button>
          </div>
        )}
        {imageToSend && <div className="px-3 py-2 bg-white border-t flex items-center gap-2"><img src={imageToSend} alt="" className="h-12 w-12 object-cover rounded" /><button onClick={() => setImageToSend("")} className="text-red-500 text-xs">Remove</button></div>}
        <div className="bg-[#F0F2F5] px-3 py-2 flex items-center gap-2 flex-shrink-0">
          <label className="cursor-pointer"><ImagePlus className="w-5 h-5 text-gray-600" /><input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if(!f) return; const reader = new FileReader(); reader.onload = () => setImageToSend(reader.result); reader.readAsDataURL(f); }} /></label>
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key==="Enter" && handleSend()} placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-white rounded-full text-sm outline-none border-none" disabled={isSending} />
          <button onClick={handleSend} disabled={(!inputText.trim() && !imageToSend) || isSending} className={`w-10 h-10 rounded-full flex items-center justify-center ${(!inputText.trim() && !imageToSend) || isSending ? "bg-gray-300 text-gray-400" : "bg-[#005C4B] text-white"}`}>{isSending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}</button>
        </div>
      </main>
    </div>
  );
}