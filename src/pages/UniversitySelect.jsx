import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const universities = [
  { id: 'wits', name: 'University of the Witwatersrand', short: 'Wits', location: 'Johannesburg', color: '#1a237e' },
  { id: 'uct', name: 'University of Cape Town', short: 'UCT', location: 'Cape Town', color: '#003366' },
  { id: 'stellies', name: 'Stellenbosch University', short: 'Stellenbosch', location: 'Stellenbosch', color: '#8B0000' },
  { id: 'up', name: 'University of Pretoria', short: 'UP', location: 'Pretoria', color: '#000080' },
  { id: 'ukzn', name: 'University of KwaZulu-Natal', short: 'UKZN', location: 'Durban', color: '#800000' },
  { id: 'uj', name: 'University of Johannesburg', short: 'UJ', location: 'Johannesburg', color: '#FF6600' },
  { id: 'nmu', name: 'Nelson Mandela University', short: 'NMU', location: 'Gqeberha', color: '#006400' },
  { id: 'nwu', name: 'North-West University', short: 'NWU', location: 'Potchefstroom', color: '#800080' },
  { id: 'ufs', name: 'University of the Free State', short: 'UFS', location: 'Bloemfontein', color: '#FFD700' },
  { id: 'uwc', name: 'University of the Western Cape', short: 'UWC', location: 'Cape Town', color: '#FF4500' },
  { id: 'ul', name: 'University of Limpopo', short: 'UL', location: 'Polokwane', color: '#008080' },
  { id: 'univen', name: 'University of Venda', short: 'Univen', location: 'Thohoyandou', color: '#228B22' },
  { id: 'unizulu', name: 'University of Zululand', short: 'Unizulu', location: 'Richards Bay', color: '#8B008B' },
  { id: 'tut', name: 'Tshwane University of Technology', short: 'TUT', location: 'Pretoria', color: '#FF8C00' },
  { id: 'cput', name: 'Cape Peninsula University of Technology', short: 'CPUT', location: 'Cape Town', color: '#2E8B57' },
  { id: 'dut', name: 'Durban University of Technology', short: 'DUT', location: 'Durban', color: '#4169E1' },
  { id: 'vut', name: 'Vaal University of Technology', short: 'VUT', location: 'Vanderbijlpark', color: '#B22222' },
  { id: 'muts', name: 'Mangosuthu University of Technology', short: 'MUT', location: 'Durban', color: '#006400' },
  { id: 'unisa', name: 'University of South Africa', short: 'UNISA', location: 'Pretoria', color: '#1a237e' },
  { id: 'sol-plaatje', name: 'Sol Plaatje University', short: 'SPU', location: 'Kimberley', color: '#DAA520' },
  { id: 'ump', name: 'University of Mpumalanga', short: 'UMP', location: 'Mbombela', color: '#4B0082' },
  { id: 'smu', name: 'Sefako Makgatho Health Sciences University', short: 'SMU', location: 'Pretoria', color: '#2F4F4F' },
  { id: 'wsu', name: 'Walter Sisulu University', short: 'WSU', location: 'Mthatha', color: '#8B0000' },
  { id: 'rhodes', name: 'Rhodes University', short: 'Rhodes', location: 'Makhanda', color: '#000080' },
];

const UniversitySelect = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.short.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUniversity = (university) => {
    localStorage.setItem('selectedUniversity', JSON.stringify(university));
    // RootRoute (in App.js) listens for this event to know it should
    // re-check localStorage and switch from the picker to Home. Without
    // this, navigate('/') is a no-op since we're already on "/", and
    // nothing would tell RootRoute that a university was just saved.
    window.dispatchEvent(new Event('universitySelected'));
    setSelectedUniversity(university);
    setIsRedirecting(true);
    toast.success(`Welcome to ${university.name}! 🎓`);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a237e] to-[#0d1550] flex items-center justify-center px-4">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Welcome to {selectedUniversity?.short}!</h2>
          <p className="text-white/70 mt-2">Redirecting to your campus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] to-[#0d1550] flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-2 mb-4">
            <span className="text-white/70 text-sm font-medium">🇿🇦 South Africa</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Choose Your University
          </h1>
          <p className="text-white/70 text-lg">
            Select your university to access your campus community
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search by university name or location..."
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredUniversities.map((uni) => (
            <button
              key={uni.id}
              onClick={() => handleSelectUniversity(uni)}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-left hover:bg-white/10 transition-all hover:scale-[1.02] hover:border-white/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-base">{uni.short}</h3>
                  <p className="text-white/60 text-sm truncate">{uni.name}</p>
                  <div className="flex items-center gap-1 mt-1 text-white/40 text-xs">
                    <MapPin size={12} />
                    <span>{uni.location}</span>
                  </div>
                </div>
                <ChevronRight className="text-white/30 group-hover:text-white/60 transition-colors" size={20} />
              </div>
            </button>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/50">No universities found. Try a different search.</p>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-white/30 text-sm">
            {universities.length} universities across South Africa
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default UniversitySelect;
