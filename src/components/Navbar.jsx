import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = null; // Replace with actual auth later

  const handleLogout = () => {
    // Add logout logic later
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#1a237e]">
          <Heart className="w-6 h-6" />
          <span className="font-bold text-xl">CampusConnect</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/stories" className="text-gray-600 hover:text-[#1a237e]">Stories</Link>
          <Link to="/market" className="text-gray-600 hover:text-[#1a237e]">Market</Link>
          <Link to="/tutors" className="text-gray-600 hover:text-[#1a237e]">Tutors</Link>
          <Link to="/clubs" className="text-gray-600 hover:text-[#1a237e]">Clubs</Link>
          <Link to="/bursaries" className="text-gray-600 hover:text-[#1a237e]">Bursaries</Link>
          <Link to="/quiz" className="text-gray-600 hover:text-[#1a237e]">Quizzes</Link>
          <Link to="/lost-found" className="text-gray-600 hover:text-[#1a237e]">Lost & Found</Link>
          <Link to="/directions" className="text-gray-600 hover:text-[#1a237e]">Directions</Link>
	  <Link to="/events" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Events</Link>
	  <Link to="/announcements" className="text-gray-600 hover:text-[#1a237e]">Announcements</Link>
	  <Link to="/profile" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Profile</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600">
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <Link to="/login" className="bg-[#1a237e] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0d1550]">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
