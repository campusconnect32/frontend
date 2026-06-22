import React, { useState, useRef } from 'react';
import { Search, Calendar, Clock, MapPin, Upload, Image, X, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageCaption, setImageCaption] = useState('');
  const [imageLocation, setImageLocation] = useState('');
  const fileInputRef = useRef(null);

  const events = [
    {
      id: 1,
      title: "Faculty of Science Research Day",
      category: "academic",
      department: "Faculty of Science",
      description: "Postgraduate students and staff showcase their latest research across all science disciplines.",
      date: "Wed, 22 Jul 2026",
      time: "08:30 - 17:00",
      venue: "Science Faculty Building",
      images: [
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop"
      ]
    },
    {
      id: 2,
      title: "CCDU Career Fair 2026",
      category: "career",
      department: "CCDU",
      description: "Connect with top employers from various industries. Bring your CV and dress professionally.",
      date: "Wed, 15 Jul 2026",
      time: "09:00 - 16:00",
      venue: "Wits Conference Centre",
      images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"
      ]
    },
    {
      id: 3,
      title: "Wits Inter-Res Soccer Tournament",
      category: "sport",
      department: "Wits Sport",
      description: "Annual residence vs residence soccer tournament. Cheer on your res or register your team!",
      date: "Fri, 10 Jul 2026",
      time: "10:00 - 18:00",
      venue: "Wits Sports Grounds",
      images: [
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop"
      ]
    }
  ];

  // Sample uploaded images (in a real app, these would come from a database)
  const [sharedImages, setSharedImages] = useState([
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&h=300&fit=crop",
      caption: "Amazing turn out at the Science Research Day! 🧪",
      location: "Science Faculty Building",
      uploadedBy: "Student A",
      date: "22 Jul 2026"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
      caption: "Great networking at the Career Fair! 🤝",
      location: "Wits Conference Centre",
      uploadedBy: "Student B",
      date: "15 Jul 2026"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop",
      caption: "Intense match at the Inter-Res tournament! ⚽",
      location: "Wits Sports Grounds",
      uploadedBy: "Student C",
      date: "10 Jul 2026"
    }
  ]);

  const categories = ['All', 'Career', 'Academic', 'Social', 'Sport', 'Health', 'Other'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleShareImage = () => {
    if (uploadedImages.length === 0) return;
    
    const newImages = uploadedImages.map(img => ({
      id: Date.now() + Math.random(),
      image: img,
      caption: imageCaption || "📸 Event snapshot",
      location: imageLocation || "Campus",
      uploadedBy: "You",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }));
    
    setSharedImages([...newImages, ...sharedImages]);
    setUploadedImages([]);
    setImageCaption('');
    setImageLocation('');
    setShowUploadModal(false);
  };

  const removeUploadedImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">📅 Campus Events</h1>
          <p className="text-gray-600">Stay up to date with what's happening at Wits</p>
        </div>

        {/* Search and Upload Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events or departments..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#1a237e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Upload size={20} /> Share Photo
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#1a237e] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1a237e]">📸 Share a Photo</h2>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-4 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                {uploadedImages.length === 0 ? (
                  <div onClick={() => fileInputRef.current.click()} className="cursor-pointer">
                    <Image size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Click to upload photos</p>
                    <p className="text-xs text-gray-400">JPG, PNG, GIF up to 10MB</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img src={img} alt={`Upload ${index}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => removeUploadedImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {uploadedImages.length < 5 && (
                      <div
                        onClick={() => fileInputRef.current.click()}
                        className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#1a237e]"
                      >
                        <Plus size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Caption and Location */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                    placeholder="What's happening in this photo?"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                    placeholder="Where was this taken?"
                    value={imageLocation}
                    onChange={(e) => setImageLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleShareImage}
                  disabled={uploadedImages.length === 0}
                  className="flex-1 bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share Photo
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shared Photos Section */}
        {sharedImages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1a237e] mb-4">📸 Shared Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sharedImages.map((img) => (
                <div key={img.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <img src={img.image} alt={img.caption} className="w-full h-48 object-cover" />
                  <div className="p-3">
                    <p className="text-sm text-gray-700">{img.caption}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <MapPin size={12} />
                      <span>{img.location}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                      <span>📤 {img.uploadedBy}</span>
                      <span>{img.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Grid */}
        <h2 className="text-xl font-bold text-[#1a237e] mb-4">📅 Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              {event.images && event.images.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-[#1a237e]">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.category === 'academic' ? 'bg-purple-100 text-purple-700' :
                    event.category === 'career' ? 'bg-blue-100 text-blue-700' :
                    event.category === 'social' ? 'bg-pink-100 text-pink-700' :
                    event.category === 'sport' ? 'bg-green-100 text-green-700' :
                    event.category === 'health' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{event.department}</p>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{event.time}</span>
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{event.venue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No events found. Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
