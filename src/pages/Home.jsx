import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  MapPin,
  Navigation,
  Calendar,
  Megaphone,
  Users,
  BookOpen,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const Home = () => {
  const sections = [
    {
      id: 'tutors',
      title: 'Tutors',
      description: 'Find or become a tutor — knowledge shared is knowledge multiplied',
      icon: BookOpen,
      link: '/tutors',
      color: 'bg-indigo-100 text-indigo-700',
      border: 'border-indigo-200'
    },
    {
      id: 'market',
      title: 'Market',
      description: 'Buy and sell essentials within your campus community',
      icon: ShoppingBag,
      link: '/market',
      color: 'bg-emerald-100 text-emerald-700',
      border: 'border-emerald-200'
    },
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'Campus closures, maintenance notices & urgent updates',
      icon: Megaphone,
      link: '/announcements',
      color: 'bg-orange-100 text-orange-700',
      border: 'border-orange-200'
    },
    {
      id: 'clubs',
      title: 'Clubs',
      description: 'Campus clubs & groups — connect with your community',
      icon: Users,
      link: '/clubs',
      color: 'bg-yellow-100 text-yellow-700',
      border: 'border-yellow-200'
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Discover events hosted by Wits departments & societies',
      icon: Calendar,
      link: '/events',
      color: 'bg-pink-100 text-pink-700',
      border: 'border-pink-200'
    },
    {
      id: 'lost-found',
      title: 'Lost & Found',
      description: 'Report items found around campus and help fellow students',
      icon: MapPin,
      link: '/lost-found',
      color: 'bg-blue-100 text-blue-700',
      border: 'border-blue-200'
    },
    {
      id: 'bursaries',
      title: 'Bursaries',
      description: 'Find and apply for bursaries to fund your studies',
      icon: DollarSign,
      link: '/bursaries',
      color: 'bg-rose-100 text-rose-700',
      border: 'border-rose-200'
    },
    {
      id: 'quiz',
      title: 'Quizzes',
      description: 'Test your knowledge with general & degree-specific quizzes',
      icon: Brain,
      link: '/quiz',
      color: 'bg-purple-100 text-purple-700',
      border: 'border-purple-200'
    },
    {
      id: 'directions',
      title: 'Directions',
      description: 'Walkthrough videos and step-by-step campus directions',
      icon: Navigation,
      link: '/directions',
      color: 'bg-green-100 text-green-700',
      border: 'border-green-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#1a237e]">Welcome to CampusConnect</h1>
          <p className="text-gray-600 mt-2">Your digital home for student life</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-white rounded-xl p-6 shadow-sm border ${section.border} hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-3`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a237e]">{section.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to={section.link}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#1a237e] hover:text-[#0d1550] transition-colors"
                >
                  Go →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-400 border-t border-gray-200 pt-6">
          <p>Built with purpose. For students, by students.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
