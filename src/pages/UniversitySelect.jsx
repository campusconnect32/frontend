import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const universities = [
  { id: 'wits', name: 'University of the Witwatersrand', short: 'Wits', location: 'Johannesburg' },
  { id: 'uct', name: 'University of Cape Town', short: 'UCT', location: 'Cape Town' },
  { id: 'stellies', name: 'Stellenbosch University', short: 'Stellenbosch', location: 'Stellenbosch' },
  { id: 'up', name: 'University of Pretoria', short: 'UP', location: 'Pretoria' },
  { id: 'ukzn', name: 'University of KwaZulu-Natal', short: 'UKZN', location: 'Durban' },
  { id: 'uj', name: 'University of Johannesburg', short: 'UJ', location: 'Johannesburg' },
  { id: 'nmu', name: 'Nelson Mandela University', short: 'NMU', location: 'Gqeberha' },
  { id: 'nwu', name: 'North-West University', short: 'NWU', location: 'Potchefstroom' },
  { id: 'ufs', name: 'University of the Free State', short: 'UFS', location: 'Bloemfontein' },
  { id: 'uwc', name: 'University of the Western Cape', short: 'UWC', location: 'Cape Town' },
  { id: 'ul', name: 'University of Limpopo', short: 'UL', location: 'Polokwane' },
  { id: 'univen', name: 'University of Venda', short: 'Univen', location: 'Thohoyandou' },
  { id: 'unizulu', name: 'University of Zululand', short: 'Unizulu', location: 'Richards Bay' },
  { id: 'tut', name: 'Tshwane University of Technology', short: 'TUT', location: 'Pretoria' },
  { id: 'cput', name: 'Cape Peninsula University of Technology', short: 'CPUT', location: 'Cape Town' },
  { id: 'dut', name: 'Durban University of Technology', short: 'DUT', location: 'Durban' },
  { id: 'vut', name: 'Vaal University of Technology', short: 'VUT', location: 'Vanderbijlpark' },
  { id: 'muts', name: 'Mangosuthu University of Technology', short: 'MUT', location: 'Durban' },
  { id: 'unisa', name: 'University of South Africa', short: 'UNISA', location: 'Pretoria' },
  { id: 'sol-plaatje', name: 'Sol Plaatje University', short: 'SPU', location: 'Kimberley' },
  { id: 'ump', name: 'University of Mpumalanga', short: 'UMP', location: 'Mbombela' },
  { id: 'smu', name: 'Sefako Makgatho Health Sciences University', short: 'SMU', location: 'Pretoria' },
  { id: 'wsu', name: 'Walter Sisulu University', short: 'WSU', location: 'Mthatha' },
  { id: 'rhodes', name: 'Rhodes University', short: 'Rhodes', location: 'Makhanda' },
];

const UniversitySelect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if a university is already saved
  useEffect(() => {
    const saved = localStorage.getItem('selectedUniversity');
    if (saved) {
      navigate('/');
    }
  }, [navigate]);

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.short.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUniversity = (university) => {
   localStorage.setItem('selectedUniversity', JSON.stringify(university));
   setSelectedUniversity(university);
   setIsRedirecting(true);
   toast.success(`Welcome to ${university.name}! 🎓`);
   setTimeout(() => {
    navigate('/signup');
  }, 800);
};

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-[#1a237e] flex items-center justify-center text-white text-center">
        <div>
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Welcome to {selectedUniversity?.short}!</h2>
          <p className="text-white/70 mt-2">Redirecting to your campus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] to-[#0d1550] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Choose Your University</h1>
          <p className="text-white/70 text-lg">Select your university to access your campus community</p>
          {user?.email && (
            <p className="text-white/50 text-sm mt-2">📧 Logged in as: {user.email}</p>
          )}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
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
          <p className="text-white/30 text-sm">{universities.length} universities across South Africa</p>
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
