import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { resetPassword } from "@/lib/api";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="text-sm text-purple-600 hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Password reset successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Reset failed");
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
          <h1 className="font-display text-2xl font-semibold">New Password</h1>
          <p className="text-sm text-[#6B6B70] mt-1">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase">New Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="neo-input mt-1"
              type="password"
              placeholder="At least 6 characters"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="neo-btn bg-purple-600 border-purple-600 w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-purple-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}