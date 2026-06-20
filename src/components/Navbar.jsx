import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const NAV = [
  { to: "/stories",  label: "Stories" },
  { to: "/market",   label: "Market" },
  { to: "/tutors",   label: "Tutors" },
  { to: "/clubs",    label: "Clubs"  },
  { to: "/bursaries",label: "Bursaries" },
  { to: "/quiz",     label: "Quizzes" },
  { to: "/profile",  label: "Profile" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (!user) return null;
  const onLogout = async () => { await logout(); navigate("/"); };

  return (
    <nav className="sticky top-0 z-40 bg-[#F4F1EA]/80 backdrop-blur-xl border-b border-[#E2DCCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/profile" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 bg-[#0F0F10] rounded-full grid place-items-center">
            <span className="font-display text-white text-[15px] leading-none italic">cc</span>
          </div>
          <div className="leading-none">
            <div className="font-display text-[19px] font-semibold tracking-tight text-[#0F0F10]">
              Campus<span className="italic text-[#C4553F]">.</span>Connect
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#8A8578] mt-0.5">Est. for students</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative px-3 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                  active ? "text-[#0F0F10]" : "text-[#5A574E] hover:text-[#0F0F10]"
                }`}
              >
                {n.label}
                {active && (
                  <span className="absolute left-3 right-3 -bottom-[1px] h-px bg-[#C4553F]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-[#5A574E] hover:text-[#C4553F] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 rounded-md hover:bg-[#EAE3D2] text-[#0F0F10]">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] bg-[#F4F1EA] border-l border-[#E2DCCE] p-0">
              <SheetHeader className="px-6 py-6 border-b border-[#E2DCCE] text-left">
                <SheetTitle className="font-display text-2xl font-semibold tracking-tight">
                  Menu<span className="italic text-[#C4553F]">.</span>
                </SheetTitle>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8A8578] mt-1">Navigate</p>
              </SheetHeader>
              <div className="flex flex-col p-3 gap-0.5">
                {NAV.map((n) => (
                  <SheetClose asChild key={n.to}>
                    <Link
                      to={n.to}
                      className="group flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-medium hover:bg-[#EAE3D2] transition-colors"
                    >
                      <span>{n.label}</span>
                      <span className="text-[#C4553F] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  </SheetClose>
                ))}
                <div className="h-px bg-[#E2DCCE] my-3" />
                <SheetClose asChild>
                  <button onClick={onLogout} className="flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-medium text-[#C4553F] hover:bg-[#F4E7E1]">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </SheetClose>
              </div>
              <div className="px-6 py-4 border-t border-[#E2DCCE] text-[11px] uppercase tracking-[0.15em] text-[#8A8578]">
                Signed in as <span className="text-[#0F0F10] normal-case tracking-normal">{user.email}</span>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}