import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [university, setUniversity] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedUniversity');
    if (saved) {
      try {
        setUniversity(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing university:', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-[#1a237e]" onClick={closeMenu}>
            <Heart className="w-6 h-6" />
            <span className="font-bold text-xl">CampusConnect</span>
          </Link>
          {university && (
            <span className="text-xs text-[#6B6B70] bg-gray-100 px-2 py-0.5 rounded hidden sm:inline">
              {university.short}
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/market" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Market</Link>
          <Link to="/tutors" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Tutors</Link>
          <Link to="/bursaries" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Bursaries</Link>
          <Link to="/quiz" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Quizzes</Link>
          <Link to="/lost-found" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Lost & Found</Link>
          <Link to="/events" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Events</Link>
          <Link to="/announcements" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Announcements</Link>
          <Link to="/resources" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Resources</Link>
          <Link to="/social-groups" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Social Groups</Link>
          <Link to="/feedback" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Feedback</Link>
          <Link to="/profile" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Profile</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#1a237e] rounded-full animate-spin"></div>
            </div>
          ) : user ? (
            <button onClick={handleLogout} className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-red-600">
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <Link to="/login" className="hidden sm:block bg-[#1a237e] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0d1550]">
              Sign In
            </Link>
          )}

          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-600 hover:text-[#1a237e] p-1"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-200 flex flex-col gap-1">
          <Link to="/market" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Market</Link>
          <Link to="/tutors" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Tutors</Link>
          <Link to="/bursaries" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Bursaries</Link>
          <Link to="/quiz" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Quizzes</Link>
          <Link to="/lost-found" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Lost & Found</Link>
          <Link to="/events" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Events</Link>
          <Link to="/announcements" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Announcements</Link>
          <Link to="/resources" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Resources</Link>
          <Link to="/social-groups" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Social Groups</Link>
          <Link to="/feedback" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Feedback</Link>
          <Link to="/profile" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>Profile</Link>
          
          <div className="border-t border-gray-200 my-2"></div>
          
          {loading ? (
            <div className="px-3 py-2 text-gray-400 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#1a237e] rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          ) : user ? (
            <button 
              onClick={() => { handleLogout(); closeMenu(); }} 
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="px-3 py-2 text-[#1a237e] font-semibold hover:bg-gray-50 rounded-lg" onClick={closeMenu}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
