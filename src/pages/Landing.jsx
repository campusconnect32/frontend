import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { googleAuth } from "@/lib/api";
import { Loader2, Mail, AlertTriangle, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const HERO_IMAGE =
  "https://tse1.mm.bing.net/th/id/OIP.BWJp6VdQ5dXnGZn9-A6ctAHaH0?rs=1&pid=ImgDetMain&o=7&rm=3";

export default function Landing() {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const [googleError, setGoogleError] = useState(false);
  const mountedRef = useRef(true);
  const googleInitialized = useRef(false);
  const initCalled = useRef(false);

  useEffect(() => {
    if (!loading && user) navigate("/profile", { replace: true });
  }, [user, loading, navigate]);

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
              await refresh();
              toast.success("Welcome to CampusConnect!");
            }
          } catch (error) {
            console.error("Google login failed:", error);
            if (mountedRef.current) toast.error("Login failed. Please try again.");
          } finally {
            if (mountedRef.current) setIsLoggingIn(false);
          }
        },
      });
      if (mountedRef.current) {
        setGoogleAvailable(true);
        setGoogleError(false);
      }
    } catch (err) {
      console.error("Google initialization error:", err);
      if (mountedRef.current) setGoogleError(true);
    }
  };

  const handleGoogleLogin = useCallback(() => {
    if (isLoggingIn || !googleAvailable || googleError) return;
    setIsLoggingIn(true);
    window.google.accounts.id.prompt();
  }, [isLoggingIn, googleAvailable, googleError]);

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#0F0F10] overflow-hidden">
      {/* Top bar */}
      <nav className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="flex items-baseline gap-2 text-[#F4F1EA] mix-blend-difference">
          <span className="font-display text-2xl tracking-tight">CampusConnect</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
            est. ’26
          </span>
        </Link>
        <div className="flex items-center gap-5 text-[#F4F1EA] mix-blend-difference">
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] border-b border-current pb-0.5"
            >
              Open app
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:inline text-xs uppercase tracking-[0.25em] hover:opacity-70"
              >
                Sign in
              </Link>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn || !googleAvailable || googleError}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] border-b border-current pb-0.5 disabled:opacity-40"
              >
                {isLoggingIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {isLoggingIn ? "Signing in" : "Join"}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen w-full">
        {/* Image panel */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[55%] overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Campus"
            className="absolute inset-0 w-full h-full object-cover grayscale-[15%] contrast-[1.05]"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%230F0F10'/%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F1EA] via-[#F4F1EA]/30 to-transparent md:from-[#F4F1EA]/90 md:via-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10]/40 via-transparent to-transparent" />
        </div>

        {/* Editorial grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20 grid grid-cols-12 gap-6 min-h-screen items-center">
          {/* Eyebrow rail */}
          <div className="col-span-12 md:col-span-1 flex md:flex-col gap-3 md:gap-6 items-start md:pt-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0F0F10]/60">
              № 01
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C4553F]">
              / Issue
            </span>
          </div>

          {/* Headline + CTAs */}
          <div className="col-span-12 md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#0F0F10]/60 mb-6">
              A field guide for student life
            </p>
            <h1 className="font-display text-[#0F0F10] leading-[0.92] tracking-[-0.02em] text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem]">
              Welcome
              <br />
              to <span className="italic font-light text-[#C4553F]">Campus</span>
              <br />
              Connect<span className="text-[#C4553F]">.</span>
            </h1>
            <p className="mt-8 max-w-md text-[#0F0F10]/70 text-base md:text-lg leading-relaxed">
              Find tutors, swap notes, and meet the people who make your campus
              feel like home — all in one quiet, considered place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg">
              {googleError ? (
                <div className="flex items-center gap-3 bg-[#0F0F10] text-[#F4F1EA] px-5 py-4 text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#C4553F]" />
                  <span>Google sign‑in is unavailable. Try email instead.</span>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn || !googleAvailable}
                  className="group relative inline-flex items-center justify-center gap-3 bg-[#0F0F10] text-[#F4F1EA] px-8 h-14 rounded-full text-sm uppercase tracking-[0.2em] transition-all hover:shadow-[0_12px_40px_-12px_rgba(196,85,63,0.6)] disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4 invert" />
                  )}
                  {isLoggingIn ? "Signing in" : "Continue with Google"}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-3 border border-[#0F0F10] text-[#0F0F10] px-8 h-14 rounded-full text-sm uppercase tracking-[0.2em] hover:bg-[#0F0F10] hover:text-[#F4F1EA] transition-colors"
              >
                <Mail className="w-4 h-4" /> Email signup
              </Link>
            </div>

            <div className="mt-6 text-sm text-[#0F0F10]/60">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-[#0F0F10] border-b border-[#0F0F10]/30 hover:border-[#C4553F] hover:text-[#C4553F]"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Right margin meta (desktop) */}
          <div className="hidden md:flex col-span-4 flex-col items-end justify-end h-full pb-4">
            <div className="text-right max-w-[14rem]">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#F4F1EA] mb-2 mix-blend-difference">
                Volume One
              </p>
              <p className="font-display italic text-[#F4F1EA] text-xl leading-snug mix-blend-difference">
                “The whole of campus, gathered into a single page.”
              </p>
            </div>
          </div>
        </div>

        {/* Footer rule */}
        <div className="absolute bottom-0 inset-x-0 z-10 border-t border-[#0F0F10]/15">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[#0F0F10]/60">
            <span>Tutors · Notes · Community</span>
            <span className="hidden md:inline">Scroll —</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
