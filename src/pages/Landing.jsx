import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, ArrowRight, BookOpen, Users, ShoppingBag, ClipboardList } from "lucide-react";

const HERO_IMAGE =
  "";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const pillars = [
    { icon: ShoppingBag, label: "Marketplace", desc: "Buy and sell essentials within your campus community." },
    { icon: BookOpen, label: "Tutors", desc: "Find or become a tutor. Knowledge shared is knowledge multiplied." },
    { icon: Users, label: "Clubs & Societies", desc: "Join student‑led groups that shape campus culture." },
    { icon: ClipboardList, label: "Quizzes", desc: "Test your knowledge and compete with fellow students." },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans overflow-hidden selection:bg-[#C4553F]/20">
      {/* Navigation */}
      <nav className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="flex items-baseline gap-2 text-[#F4F1EA] mix-blend-difference">
          <span className="font-serif text-2xl tracking-tight font-semibold">CampusConnect</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
            EST. '26
          </span>
        </Link>
        <div className="flex items-center gap-5 text-[#F4F1EA] mix-blend-difference">
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] border-b border-current pb-0.5"
            >
              Open app
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:inline text-xs uppercase tracking-[0.25em] hover:opacity-70"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] border-b border-current pb-0.5"
              >
                Join
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover grayscale-[30%] contrast-110"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23111827'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='white' font-size='2rem' font-family='serif'%3ECampusConnect%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F10]/80 via-[#0F0F10]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10]/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-32 md:py-40">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F4F1EA]/70 mb-6">
              The Student Common Room — Reimagined
            </p>
            <h1 className="font-serif text-[#F4F1EA] leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              Where your campus<br />
              <span className="italic font-light">truly</span> comes alive.
            </h1>
            <p className="mt-8 max-w-xl text-[#F4F1EA]/80 text-lg leading-relaxed">
              CampusConnect is the official digital home for student life.
              <br />
              Market, Tutoring, Clubs, Quizzes — all in one place, built with purpose.
            </p>

            <div className="mt-12">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-3 bg-[#F4F1EA] text-[#0F0F10] px-8 h-14 rounded-full text-sm font-medium uppercase tracking-[0.15em] transition-all hover:shadow-[0_12px_40px_-12px_rgba(196,85,63,0.8)]"
              >
                <Mail className="w-4 h-4" /> Sign up with your student email
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 text-sm text-[#F4F1EA]/60">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-[#F4F1EA] border-b border-[#F4F1EA]/40 hover:border-[#C4553F] hover:text-[#C4553F] transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 z-10 border-t border-[#F4F1EA]/15">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[#F4F1EA]/60">
            <span>Marketplace · Tutors · Clubs · Quizzes</span>
            <span className="hidden md:inline">Scroll —</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </section>

      {/* Pillars section */}
      <section className="bg-[#0F0F10] text-[#F4F1EA] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C4553F] mb-4">
              Our Pillars
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">
              Everything students need,<br />
              <span className="italic font-light">purposefully gathered.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="group border-t border-[#F4F1EA]/20 pt-6">
                <pillar.icon className="w-6 h-6 text-[#C4553F] mb-4" />
                <h3 className="font-serif text-xl mb-2">{pillar.label}</h3>
                <p className="text-[#F4F1EA]/70 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0F10] border-t border-[#F4F1EA]/10 py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-[#F4F1EA]/40 text-xs">
          <span>© {new Date().getFullYear()} CampusConnect. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Built with purpose. For students, by students.</span>
        </div>
      </footer>
    </div>
  );
}