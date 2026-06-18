import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { googleAuth } from "@/lib/api";
import { Heart, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

const heroImage =
  "https://tse1.mm.bing.net/th/id/OIP.BWJp6VdQ5dXnGZn9-A6ctAHaH0?rs=1&pid=ImgDetMain&o=7&rm=3";

export default function Landing() {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const refCode = localStorage.getItem("stokvel_ref");
  const googleInitialized = useRef(false);
  const initCalled = useRef(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/profile", { replace: true });
    }
    if (!initCalled.current) {
      initCalled.current = true;
      loadGoogleScript();
    }
  }, [user, loading]);

  const loadGoogleScript = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("Google Client ID not configured");
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
    document.head.appendChild(script);
  };

  const initGoogle = (clientId) => {
    if (googleInitialized.current) return;
    googleInitialized.current = true;

    window.google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: "popup",
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: async (response) => {
        try {
          if (!response.credential) throw new Error("No credential received");
          const payload = JSON.parse(atob(response.credential.split(".")[1]));
          await googleAuth(response.credential, payload.email, payload.name, payload.picture, refCode);
          await refresh();
          toast.success("Campus connect");
          navigate("/profile");
        } catch (error) {
          console.error("Login failed:", error);
          toast.error("Login Failed");
        } finally {
          setIsLoggingIn(false);
        }
      },
    });

    setGoogleAvailable(true);
  };

  const handleGoogleLogin = useCallback(() => {
    if (isLoggingIn || !googleAvailable) return;
    setIsLoggingIn(true);
    window.google.accounts.id.prompt();
  }, [isLoggingIn, googleAvailable]);

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
                disabled={isLoggingIn || !googleAvailable}
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
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/30" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 md:px-12 flex items-center">
          <div className="animate-fade-in w-full">
            <h1 className="font-display text-white text-3xl md:text-6xl lg:text-7xl leading-[1.1] max-w-4xl">
              Welcome to CampusConnect
            </h1>
            <div className="mt-8 flex flex-col gap-3 max-w-sm">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn || !googleAvailable}
                className="neo-btn bg-primary border-primary text-primary-foreground !px-8 !h-12 !text-base !rounded-full flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt=""
                    className="w-5 h-5"
                  />
                )}
                {isLoggingIn ? "Signing in..." : "Continue with Google"}
              </button>
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
