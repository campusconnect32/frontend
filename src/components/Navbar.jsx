import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [university, setUniversity] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const handleChangeUniversity = () => {
    localStorage.removeItem('selectedUniversity');
    window.dispatchEvent(new Event('universitySelected'));
    navigate('/');
    setMobileOpen(false);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  // All navigation links
  const navLinks = [
    { to: '/market', label: 'Market' },
    { to: '/tutors', label: 'Tutors' },
    { to: '/clubs', label: 'Clubs' },
    { to: '/bursaries', label: 'Bursaries' },
    { to: '/quiz', label: 'Quizzes' },
    { to: '/lost-found', label: 'Lost & Found' },
    { to: '/directions', label: 'Directions' },
    { to: '/events', label: 'Events' },
    { to: '/announcements', label: 'Announcements' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + university badge */}
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

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-600 hover:text-[#1a237e] text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-600 hover:text-[#1a237e] p-1"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 mt-2 pt-2 pb-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1a237e] hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-200">
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block text-center px-3 py-2 mx-3 bg-[#1a237e] text-white rounded-lg text-base font-medium hover:bg-[#0d1550]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;