import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/lib/api";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email required");
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      setSent(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#0F0F10] text-white rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6" fill="currentColor" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Reset Password</h1>
          <p className="text-sm text-[#6B6B70] mt-1">Enter your email and we'll send you a reset link</p>
        </div>

        {sent ? (
          <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-700 mb-4">If that email is registered, you'll receive a password reset link.</p>
            <Link to="/login" className="text-sm text-purple-600 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase">Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="neo-input mt-1"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="neo-btn bg-purple-600 border-purple-600 w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-purple-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}