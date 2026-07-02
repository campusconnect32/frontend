import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Phone, AlertCircle, Plus, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const LostFound = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    location: '',
    leftAt: '',
    description: '',
    contact: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lost_found')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('lost_found')
        .insert([{
          ...newItem,
          user_id: user?.id,
          status: 'found',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        }])
        .select();
      if (error) throw error;
      setItems([data[0], ...items]);
      setShowReportForm(false);
      setNewItem({ title: '', location: '', leftAt: '', description: '', contact: '' });
      toast.success('Item reported successfully!');
    } catch (error) {
      console.error('Error reporting item:', error);
      toast.error('Failed to report item');
    }
  };

  const handleClaimItem = async (id) => {
    try {
      const item = items.find(i => i.id === id);
      const newStatus = item.status === 'claimed' ? 'found' : 'claimed';
      const { error } = await supabase
        .from('lost_found')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      setItems(items.map(i => i.id === id ? { ...i, status: newStatus } : i));
      toast.success(`Item ${newStatus === 'claimed' ? 'claimed' : 'marked as found'}`);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">📋 Lost & Found</h1>
          <p className="text-gray-600">Report items you've found around campus</p>
        </div>

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

        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="w-full mb-6 bg-[#1a237e] text-white py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Report Found Item
        </button>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Where did you leave it?</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                    value={newItem.leftAt}
                    onChange={(e) => setNewItem({...newItem, leftAt: e.target.value})}
                    placeholder="e.g. Library front desk"
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
                  <button type="submit" className="flex-1 bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors">
                    Submit Report
                  </button>
                  <button type="button" onClick={() => setShowReportForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No items found. Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-[#1a237e]">{item.title}</h3>
                  <button onClick={() => handleClaimItem(item.id)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    item.status === 'claimed' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}>
                    {item.status === 'claimed' ? <span className="flex items-center gap-1"><CheckCircle size={14} /> Claimed</span> : <span className="flex items-center gap-1"><XCircle size={14} /> Mark as Claimed</span>}
                  </button>
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
        )}
      </div>
    </div>
  );
};

export default LostFound;
