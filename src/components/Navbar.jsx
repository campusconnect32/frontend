import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = null; // Replace with actual auth later
  const [university, setUniversity] = useState(null);

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

  const handleLogout = () => {
    navigate('/');
  };

  const handleChangeUniversity = () => {
    // Clearing the saved university and dispatching this event tells
    // RootRoute (in App.js) to re-check localStorage and fall back to the
    // picker. navigate('/') alone wouldn't be enough since we're already
    // on "/" — the location doesn't change, so nothing would otherwise
    // tell RootRoute to re-render.
    localStorage.removeItem('selectedUniversity');
    window.dispatchEvent(new Event('universitySelected'));
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-[#1a237e]">
            <Heart className="w-6 h-6" />
            <span className="font-bold text-xl">CampusConnect</span>
          </Link>
          {university && (
            <button
              onClick={handleChangeUniversity}
              title="Click to change university"
              className="text-xs text-[#6B6B70] bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200 hover:text-[#1a237e] transition-colors"
            >
              {university.short}
            </button>
          )}
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/market" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Market</Link>
          <Link to="/tutors" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Tutors</Link>
          <Link to="/clubs" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Clubs</Link>
          <Link to="/bursaries" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Bursaries</Link>
          <Link to="/quiz" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Quizzes</Link>
          <Link to="/lost-found" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Lost & Found</Link>
          <Link to="/directions" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Directions</Link>
          <Link to="/events" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Events</Link>
          <Link to="/announcements" className="text-gray-600 hover:text-[#1a237e] text-sm font-medium">Announcements</Link>
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
