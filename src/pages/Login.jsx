import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginEmail, googleAuth } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Heart, Loader2, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  // ----- Initialise Google ONCE per page load, using a global flag -----
  const initGoogleOnce = useCallback(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("Google Client ID not configured – email login only");
      return;
    }

    // Already initialised globally?
    if (window.__googleInitialized) {
      setGoogleReady(true);
      return;
    }

    // Load the script if needed
    if (!window.google?.accounts?.id) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleOnce();
      document.head.appendChild(script);
      return;
    }

    // Now initialise
    window.google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: "popup",
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: async (response) => {
        try {
          if (!response.credential) throw new Error("No credential received");
          const payload = JSON.parse(atob(response.credential.split(".")[1]));
          await googleAuth(
            response.credential,
            payload.email,
            payload.name,
            payload.picture
          );
          await refresh();
          toast.success("Welcome back!", {
            description: "You've successfully signed in.",
          });
          navigate("/discover");
        } catch (error) {
          console.error("Google login failed:", error);
          toast.error("Login Failed", {
            description: error.message || "Unable to sign in with Google.",
          });
        } finally {
          setIsGoogleLoggingIn(false);
        }
      },
    });

    window.__googleInitialized = true;
    setGoogleReady(true);
  }, []);

  // Trigger the one‑off init when component mounts
  if (!window.__googleInitialized) {
    initGoogleOnce();
  } else {
    // Already initialised (e.g. from Landing), just mark ready
    if (!googleReady) setGoogleReady(true);
  }

  const handleGoogleLogin = useCallback(() => {
    if (isGoogleLoggingIn || !googleReady) return;
    setIsGoogleLoggingIn(true);
    window.google.accounts.id.prompt();
  }, [isGoogleLoggingIn, googleReady]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password required");
    setLoading(true);
    try {
      const data = await loginEmail(email, password);
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
          <p className="text-sm text-[#6B6B70] mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-5">
          {/* Google Sign‑In – on top */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoggingIn || !googleReady}
            className="neo-btn bg-white border-gray-300 text-[#0F0F10] !px-4 !h-12 !text-base !rounded-full shadow-sm hover:bg-gray-50 disabled:opacity-50 w-full flex items-center justify-center gap-2"
          >
            {isGoogleLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <img
                src="https://www.google.com/favicon.ico"
                alt=""
                className="w-5 h-5"
              />
            )}
            {isGoogleLoggingIn ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E7E5E0]" />
            <span className="text-xs text-[#6B6B70] uppercase font-medium">or</span>
            <div className="flex-1 h-px bg-[#E7E5E0]" />
          </div>

          {/* Email / Password Login */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
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