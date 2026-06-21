import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Phone, AlertCircle, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';

const LostFound = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "Black North Face jacket",
      location: "Wartenweiler Library, 2nd floor study area",
      leftAt: "Library front desk",
      description: "Size medium, has a small tear on the left sleeve",
      contact: "WhatsApp: 081 234 5678",
      date: "20 Jun 2026",
      status: "found"
    },
    {
      id: 2,
      title: "iPhone charger and cable",
      location: "Solomon Mahlangu House, outside ground floor",
      leftAt: "Solomon Mahlangu reception",
      description: "White Apple charger with braided cable",
      contact: "",
      date: "20 Jun 2026",
      status: "found"
    },
    {
      id: 3,
      title: "Red A4 notebook",
      location: "Matrix Building, lecture hall 3",
      leftAt: "Student Affairs office",
      description: "Has 'BIOSCI 201' written on the cover. Contains lecture notes",
      contact: "",
      date: "20 Jun 2026",
      status: "claimed"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    location: '',
    description: '',
    contact: ''
  });

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      ...newItem,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'found',
      leftAt: 'Reported item'
    };
    setItems([item, ...items]);
    setShowReportForm(false);
    setNewItem({ title: '', location: '', description: '', contact: '' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a237e]">📋 Lost & Found</h1>
            <p className="text-gray-600">Report items you've found around campus</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by item name or location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Report Button */}
          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className="w-full mb-6 bg-[#1a237e] text-white py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Report Found Item
          </button>

          {/* Report Form */}
          {showReportForm && (
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-[#1a237e]">Report a Found Item</h3>
              <form onSubmit={handleReportSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={newItem.title}
                      onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                      placeholder="e.g. Black North Face jacket"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Where was it found?</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={newItem.location}
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                      placeholder="e.g. Wartenweiler Library, 2nd floor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      rows="3"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Describe the item (color, brand, identifying features)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={newItem.contact}
                      onChange={(e) => setNewItem({...newItem, contact: e.target.value})}
                      placeholder="WhatsApp: 081 234 5678 (optional)"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors"
                    >
                      Submit Report
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReportForm(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-[#1a237e]">{item.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'claimed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.status === 'claimed' ? '✅ Claimed' : '📍 Found'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                    <span><strong>Found:</strong> {item.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                    <span><strong>Left at:</strong> {item.leftAt}</span>
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{item.description}</p>
                  {item.contact && (
                    <div className="flex items-start gap-2">
                      <Phone size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                      <span><strong>Contact:</strong> {item.contact}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-400">{item.date}</div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
              <p>No items found. Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LostFound;
