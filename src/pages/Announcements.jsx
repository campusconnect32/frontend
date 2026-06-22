import React, { useState } from 'react';
import { Search, Clock, XCircle, Bell, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const announcements = [
    {
      id: 1,
      title: "Solomon Mahlangu Lab Temporarily Closed",
      category: "Closure",
      department: "IT Services · Solomon Mahlangu Lab",
      description: "The computer lab will be closed for the next 2 hours due to a scheduled maintenance check. Expected to reopen at 14:00. Please use the Matrix labs in the meantime.",
      status: "active",
      expiresIn: "34 minutes",
      date: "22 Jun 2026",
      priority: "high"
    },
    {
      id: 2,
      title: "Library Extended Hours During Exams",
      category: "Notice",
      department: "Wits Library Services",
      description: "The Wartenweiler Library will remain open until midnight during exam season. Additional study spaces have been made available.",
      status: "active",
      expiresIn: "2 days",
      date: "20 Jun 2026",
      priority: "medium"
    },
    {
      id: 3,
      title: "Parking Lot P1 Closed for Maintenance",
      category: "Closure",
      department: "Campus Facilities",
      description: "Parking Lot P1 (near the Engineering Building) will be closed from 22-24 June for resurfacing. Please use Lot P2 and P3 as alternatives.",
      status: "active",
      expiresIn: "1 day",
      date: "21 Jun 2026",
      priority: "high"
    },
    {
      id: 4,
      title: "Wi-Fi Maintenance Tonight",
      category: "Maintenance",
      department: "IT Services",
      description: "Campus Wi-Fi will undergo maintenance from 22:00 to 02:00. During this time, internet access may be intermittent.",
      status: "active",
      expiresIn: "5 hours",
      date: "22 Jun 2026",
      priority: "medium"
    }
  ];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || announcement.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">📢 Announcements</h1>
          <p className="text-gray-600">Campus updates, closures & notices</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'Active', 'Inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-[#1a237e] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-orange-400 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {announcement.category === 'Closure' && <XCircle className="w-5 h-5 text-red-500" />}
                  {announcement.category === 'Notice' && <Bell className="w-5 h-5 text-blue-500" />}
                  {announcement.category === 'Maintenance' && <Wrench className="w-5 h-5 text-orange-500" />}
                  {announcement.category === 'Emergency' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#1a237e]">{announcement.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        announcement.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {announcement.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{announcement.date}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{announcement.department}</p>
                  <p className="text-sm text-gray-600 mb-3">{announcement.description}</p>
                  {announcement.status === 'active' && (
                    <span className="flex items-center gap-1 text-xs text-orange-600">
                      <Clock size={14} />
                      Expires in {announcement.expiresIn}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Bell size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No announcements found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
