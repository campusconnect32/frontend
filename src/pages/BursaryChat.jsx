import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Send, Check } from "lucide-react";

export default function BursaryChat() {
  const { bursaryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const otherUserId = searchParams.get("other") || "";
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [bursary, setBursary] = useState(null);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    fetchItemInfo();
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(pollRef.current);
  }, [bursaryId, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchItemInfo = async () => {
    try {
      const res = await api.get(`/bursaries/${bursaryId}`);
      setBursary(res.data);
    } catch (err) {
      toast.error("Bursary not found");
      navigate("/bursaries");
    }
  };

  const fetchMessages = async () => {
    try {
      const params = otherUserId ? { other_user_id: otherUserId } : {};
      const res = await api.get(`/bursaries/${bursaryId}/messages`, { params });
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;
    setIsSending(true);
    setInputText("");
    try {
      await api.post(`/bursaries/${bursaryId}/messages`, { content: text });
      await fetchMessages();
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const mins = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${mins}`;
  };

  return (
    <div className="min-h-screen bg-[#EFEAE2]">
      <Navbar />
      <main className="max-w-2xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        <div className="bg-[#F0F2F5] border-b px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-200 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">🎓</div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">{bursary?.title || "Chat"}</h3>
            <p className="text-xs text-gray-500">{messages.length} messages</p>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-3 py-3 space-y-1"
          style={{
            backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAWdEVYdFRpdGxlAEJlYWNvbi5qcGVnQ1JFV0EAAAKsSURBVGiB7ZpNjtQwEEa/4gTsOUJvOEJL4gJIiAuw5QhICFbsWMI1eo4GCdHdLjtJ2amfqspf8j5p1Op2+XPZVU4nKVlZeZKkOyLiKiI+IuI2Ij4j4nO59j9K1j7LelzW5+8REWtE/FnLD7oHWDtrr8AJcDa5Tw/gj61qEwhsflK9v0TEr2WMfx7gI1X7+q4JTG/eAx4YcJvALIHpvUZEO0dawIAXX8AD4G0CC4DXSZnNA74D3MqvteCcIQ7MUzScC3JDHwHuD+B9JqwBfKMxluMALnrA+0w4MRbGcfQwBnj2BHBfB3xPwtqLfMw81tLyGBCdAW+JcDKhvYX07C5yP0/9FuvB1QSYkwlrI9BYTqjGJmGgKox7gB8RtXACsN6BngMME4BXmq8C/BmTi/wA/FyLtjEDcPx7x74E8GHyHlMP8Gj8jR7gLOLfFWCdk3gNuPzJQVa/wt1rsc8M0O3b1gSQTqMmz9QO03dk8YQlMl+R/jXLBFss9tFrwCev78xzGpv5crtQ6++zTP+O0s1t7oGL/jkP9OmfgF5u1S7ujC+QLx4bICJE4P3bIwFfvGVdGeLDM54C7t/PbwgAPuRMNYUx9xR1QdSsyCk8FgzC4wD3zPAVOORkzty2AM6BdY6BzM84oow0S3mAC8BJcTTjTwfwGfBm3KoCbsazHeBTD7ifP93iHSDdby8O8K4PeIAcnbuqAY4C4wFf2IAXDa5rnhp5nYHh+fOBTX9sg80iS1d1zxK7M1r8H9m96PJd7W2lBD5OudmlJdAc1+oLk/bNyOXrLNo4EONIvgCu83I0OpxMboGDJvXH2sUGNwuTBNzO8Vqz+4K/AYynffDA3GlvAAAAAElFTkSuQmCC')",
            backgroundColor: "#EFEAE2",
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div><div className="text-4xl mb-3">💬</div><p className="text-sm text-gray-500">No messages yet</p></div>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender_id === user?.user_id;
              const showAvatar = !isMe && (idx === 0 || messages[idx - 1]?.sender_id !== msg.sender_id);
              return (
                <div key={msg.message_id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-1`}>
                  {!isMe && (
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 mb-0.5">
                      {showAvatar ? (
                        msg.sender_picture ? (
                          <img src={msg.sender_picture} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold">{(msg.sender_name||"?")[0]}</div>
                        )
                      ) : <div className="w-9 h-9" />}
                    </div>
                  )}
                  <div className="max-w-[75%]">
                    <div className="relative">
                      {!isMe && <div className="absolute top-0 -left-[6px] w-2 h-2 bg-white" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />}
                      {isMe && <div className="absolute bottom-0 -right-[6px] w-2 h-2 bg-[#005C4B]" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />}
                      <div className={`relative ${isMe ? "bg-[#005C4B] text-white rounded-lg rounded-br-sm" : "bg-white text-gray-900 rounded-lg rounded-tl-sm"} shadow-sm`}>
                        {!isMe && <p className="px-2.5 pt-1.5 pb-0 text-[11px] font-semibold text-[#005C4B]">{msg.sender_name}</p>}
                        <div className={`${!isMe ? "px-2.5 pb-1.5 pt-0" : "px-2.5 py-1.5"} pr-16`}>
                          <p className="text-[14px] leading-[1.4] whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <div className={`absolute bottom-0.5 right-2 flex items-center gap-1 text-[10px] ${isMe ? "text-white/55" : "text-gray-400"}`}>
                          <span>{formatTime(msg.created_at)}</span>
                          {isMe && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-[#F0F2F5] px-3 py-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-white rounded-full text-sm outline-none border-none"
              disabled={isSending}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isSending}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${!inputText.trim() || isSending ? "bg-gray-300 text-gray-400" : "bg-[#005C4B] text-white"}`}
            >
              {isSending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}