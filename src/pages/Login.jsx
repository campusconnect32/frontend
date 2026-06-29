import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginEmail } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Heart, Loader2, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password required");
    setLoading(true);
    try {
      await loginEmail(email, password);
      await refresh();
      navigate("/find");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-12 h-12 bg-[#0F0F10] text-white rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" fill="currentColor" />
            </div>
          </Link>
          <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-[#6B6B70] mt-1">Sign in with your student email</p>
        </div>

        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase">Student Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="neo-input mt-1"
                type="email"
                placeholder="1234567@students.wits.ac.za"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase">Password</label>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="neo-input mt-1"
                type="password"
                placeholder="Your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="neo-btn bg-purple-600 border-purple-600 w-full !h-12 !text-base !rounded-full"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Sign in with email
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 space-y-2">
          <Link to="/forgot-password" className="text-sm text-[#6B6B70] hover:underline block">
            Forgot password?
          </Link>
          <Link to="/signup" className="text-sm text-purple-600 hover:underline block">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}