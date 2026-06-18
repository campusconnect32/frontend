import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const onLogout = async () => { await logout(); navigate("/"); };

  return (
    <nav className="sticky top-0 z-40 bg-[#FAFAF7]/85 backdrop-blur-md border-b border-[#E7E5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/profile" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-[#0F0F10] text-white rounded-md flex items-center justify-center">
            <Heart className="w-4 h-4" fill="currentColor" />
          </div>
          <span className="font-display text-lg sm:text-xl font-semibold">Campus Connect</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/market" className="text-sm font-medium text-[#262626] hover:text-[#0F0F10] px-2 py-1.5">Market</Link>
          <Link to="/tutors" className="text-sm font-medium text-[#262626] hover:text-[#0F0F10] px-2 py-1.5">Tutors</Link>
          <Link to="/clubs" className="text-sm font-medium text-[#262626] hover:text-[#0F0F10] px-2 py-1.5">Clubs</Link>
          <Link to="/profile" className="text-sm font-medium text-[#262626] hover:text-[#0F0F10] px-2 py-1.5">Profile</Link>
	  <Link to="/quiz" className="text-sm font-medium text-[#262626] hover:text-[#0F0F10] px-2 py-1.5">Quizzes</Link>        
	</div>

        <div className="flex items-center gap-2">
          <button onClick={onLogout} className="hidden md:flex p-2 rounded-md hover:bg-[#F5F3EE] text-[#6B6B70]">
            <LogOut className="w-4 h-4" />
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 rounded-md hover:bg-[#F5F3EE]">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[#FAFAF7] border-l border-[#E7E5E0] p-0">
              <SheetHeader className="px-6 py-5 border-b border-[#E7E5E0] text-left">
                <SheetTitle className="font-display text-xl">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4 gap-1">
                <SheetClose asChild>
                  <Link to="/market" className="px-3 py-3 rounded-lg text-[15px] font-medium hover:bg-[#F5F3EE]">Market</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/tutors" className="px-3 py-3 rounded-lg text-[15px] font-medium hover:bg-[#F5F3EE]">Tutors</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/clubs" className="px-3 py-3 rounded-lg text-[15px] font-medium hover:bg-[#F5F3EE]">Clubs</Link>
                </SheetClose>
		<SheetClose asChild>
  		  <Link to="/quiz" className="px-3 py-3 rounded-lg text-[#262626] hover:bg-[#F5F3EE] transition-colors">Quizzes</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/profile" className="px-3 py-3 rounded-lg text-[15px] font-medium hover:bg-[#F5F3EE]">Profile</Link>
                </SheetClose>
                <div className="h-px bg-[#E7E5E0] my-2" />
                <SheetClose asChild>
                  <button onClick={onLogout} className="flex items-center gap-2 px-3 py-3 rounded-lg text-[15px] font-medium text-[#C4553F] hover:bg-[#F4E7E1]">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </SheetClose>
              </div>
              <div className="px-6 py-4 border-t border-[#E7E5E0] text-xs text-[#6B6B70]">
                <div>Signed in as <span className="text-[#0F0F10]">{user.email}</span></div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
