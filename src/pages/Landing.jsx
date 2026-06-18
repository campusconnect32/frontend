import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { googleAuth } from "@/lib/api";
import { Heart, Loader2, Mail, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const HERO_IMAGE = "https://tse1.mm.bing.net/th/id/OIP.BWJp6VdQ5dXnGZn9-A6ctAHaH0?rs=1&pid=ImgDetMain&o=7&rm=3";

export default function Landing() {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const [googleError, setGoogleError] = useState(false);
  const mountedRef = useRef(true);
  const googleInitialized = useRef(false);
  const initCalled = useRef(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/profile", { replace: true });
    }
  }, [user, loading, navigate]);

  // Load Google Sign‑In script once
  useEffect(() => {
    if (initCalled.current) return;
    initCalled.current = true;
    mountedRef.current = true;

    loadGoogleScript();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadGoogleScript = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("Google Client ID not configured");
      setGoogleError(true);
      return;
    }

    if (window.google?.accounts?.id) {
      initGoogle(clientId);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => initGoogle(clientId);
    script.onerror = () => {
      if (mountedRef.current) {
        setGoogleError(true);
        toast.error("Failed to load Google sign‑in. Please try again later.");
      }
    };
    document.head.appendChild(script);
  };

  const initGoogle = (clientId) => {
    if (googleInitialized.current) return;
    googleInitialized.current = true;

    try {
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
              payload.picture,
              localStorage.getItem("stokvel_ref")
            );
            if (mountedRef.current) {
              await refresh();   // this will set the user, and the useEffect will redirect
              toast.success("Welcome to CampusConnect!");
            }
          } catch (error) {
            console.error("Google login failed:", error);
            if (mountedRef.current) {
              toast.error("Login failed. Please try again.");
            }
          } finally {
            if (mountedRef.current) {
              setIsLoggingIn(false);
            }
          }
        },
      });
      if (mountedRef.current) {
        setGoogleAvailable(true);
        setGoogleError(false);
      }
    } catch (err) {
      console.error("Google initialization error:", err);
      if (mountedRef.current) {
        setGoogleError(true);
      }
    }
  };

  const handleGoogleLogin = useCallback(() => {
    if (isLoggingIn || !googleAvailable || googleError) return;
    setIsLoggingIn(true);
    window.google.accounts.id.prompt();
  }, [isLoggingIn, googleAvailable, googleError]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-12 py-5 bg-black/20 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          </span>
          <span className="font-display text-2xl">CampusConnect</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={() => navigate("/profile")} className="neo-btn !py-2 !px-4 !text-xs bg-white text-black border-white">
              Open app
            </button>
          ) : (
            <>
              <Link to="/login" className="text-white/90 hover:text-white text-sm">
                Sign in
              </Link>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn || !googleAvailable || googleError}
                className="neo-btn !py-2 !px-4 !text-xs bg-white text-black border-white disabled:opacity-50"
              >
                {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                {isLoggingIn ? "Signing in..." : "Join with Google"}
              </button>
            </>
          )}
        </div>
      </nav>

      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Campus"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23111827'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='white' font-size='2rem' font-family='serif'%3ECampusConnect%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/30" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 md:px-12 flex items-center">
          <div className="animate-fade-in w-full">
            <h1 className="font-display text-white text-3xl md:text-6xl lg:text-7xl leading-[1.1] max-w-4xl">
              Welcome to CampusConnect
            </h1>
            <div className="mt-8 flex flex-col gap-3 max-w-sm">
              {googleError ? (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400 text-white rounded-xl px-4 py-3 flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>Google sign‑in is unavailable right now. Please try again later or use email.</span>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn || !googleAvailable}
                  className="neo-btn bg-primary border-primary text-primary-foreground !px-8 !h-12 !text-base !rounded-full flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
                  )}
                  {isLoggingIn ? "Signing in..." : "Continue with Google"}
                </button>
              )}
              <Link
                to="/signup"
                className="neo-btn bg-white/20 backdrop-blur-sm border-white/50 text-white !px-8 !h-12 !text-base !rounded-full flex items-center gap-2"
              >
                <Mail className="w-5 h-5" /> Sign up with email
              </Link>
            </div>
            <div className="mt-4 text-sm text-white/80">
              Already have an account?{" "}
              <Link to="/login" className="text-white underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}