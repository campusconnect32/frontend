import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function CustomerDetail() {
  const { customerId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    // Fetch the list of items discussed with this customer
    api.get(`/marketplace/customers/${customerId}/items`)
      .then(res => {
        setItems(res.data || []);
      })
      .catch(err => console.error("Failed to load customer items", err))
      .finally(() => setLoading(false));
  }, [customerId]);

  // Fetch customer name from the my-customers list
  useEffect(() => {
    api.get("/marketplace/my-customers")
      .then(res => {
        const cust = (res.data || []).find(c => c.other_user_id === customerId);
        if (cust) setCustomerName(cust.other_user_name);
      })
      .catch(err => console.error(err));
  }, [customerId]);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/market/mycustomers" className="neo-btn neo-btn-ghost">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
          <h1 className="font-display text-2xl font-semibold">
            Chat with {customerName || "Customer"}
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">No conversations found for this customer.</div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.item_id}
                className="bg-white border border-[#E7E5E0] rounded-xl p-4 flex items-center justify-between"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm truncate">{item.item_title}</h3>
                  <p className="text-xs text-[#6B6B70] mt-1 truncate">{item.last_message}</p>
                  <p className="text-xs text-[#6B6B70] mt-1">
                    {item.message_count} message{item.message_count !== 1 ? "s" : ""} · {formatTime(item.last_message_time)}
                  </p>
                </div>
                {/* Chat link with ?other=customerId to ensure private scope */}
                <Link
                  to={`/market/chat/${item.item_id}?other=${customerId}`}
                  className="neo-btn neo-btn-secondary !px-3 !py-2 flex-shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}