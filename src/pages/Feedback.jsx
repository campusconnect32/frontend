import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Send, Loader2, CheckCircle } from "lucide-react";

const Feedback = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("suggestion");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.error("Please enter your feedback.");
    setSubmitting(true);
    try {
      await api.post("/feedback", { message: message.trim(), category });
      toast.success("Thank you for your feedback!");
      setMessage("");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1a237e] mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to send feedback.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-semibold text-[#1a237e] mb-6">💬 Feedback</h1>
        <p className="text-gray-600 mb-8">
          We’d love to hear your thoughts, suggestions, or report a bug.
        </p>

        {submitted ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1a237e] mb-2">Submitted!</h3>
            <p className="text-gray-600 mb-6">Your feedback has been received. Thank you!</p>
            <button
              onClick={() => setSubmitted(false)}
              className="neo-btn bg-purple-600 border-purple-600"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="neo-input"
              >
                <option value="suggestion">💡 Suggestion</option>
                <option value="bug">🐛 Bug Report</option>
                <option value="praise">🙌 Praise</option>
                <option value="other">💬 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="neo-input min-h-[120px]"
                placeholder="Tell us what's on your mind..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="neo-btn bg-purple-600 border-purple-600 w-full"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Send Feedback</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;