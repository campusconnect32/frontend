import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function MyMarketCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/marketplace/my-customers")
      .then(res => setCustomers(res.data || []))
      .catch(err => console.error("Failed to load customers", err))
      .finally(() => setLoading(false));
  }, []);

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
        <h1 className="font-display text-3xl font-semibold mb-6">My Customers</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">
            No customers yet. When someone chats about your listing, they'll appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {customers.map((cust) => (
              <Link
                key={cust.other_user_id}
                to={`/market/customer/${cust.other_user_id}`}
                className="flex items-center gap-3 bg-white border border-[#E7E5E0] rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {cust.other_user_picture ? (
                    <img
                      src={cust.other_user_picture}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-500">
                      {(cust.other_user_name || "?")[0].toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{cust.other_user_name}</h3>
                  <p className="text-xs text-[#6B6B70]">
                    {cust.distinct_items} item{cust.distinct_items !== 1 ? "s" : ""} discussed
                  </p>
                  {cust.last_message_time && (
                    <p className="text-xs text-[#6B6B70] mt-1">
                      Last message {formatTime(cust.last_message_time)}
                    </p>
                  )}
                </div>

                <MessageCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}