import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Plus, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/clubs")
      .then(res => setClubs(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-semibold">Clubs & Societies</h1>
          <Link to="/clubs/create" className="neo-btn bg-purple-600 border-purple-600 !px-4 !py-2">
            <Plus className="w-4 h-4 mr-2" />
            Create Club
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">No clubs yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map(club => (
              <Link to={`/clubs/${club.club_id}`} key={club.club_id} className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-[#F5F3EE] flex items-center justify-center">
                  {club.image ? <img src={club.image} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl">🏛️</span>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{club.title}</h3>
                  <p className="text-sm text-[#6B6B70] line-clamp-2 mt-1">{club.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#6B6B70]">
                    <Users className="w-4 h-4" />
                    <span>{club.member_count} member{club.member_count !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}