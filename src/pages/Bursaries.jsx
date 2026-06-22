import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Plus, Edit3, MessageCircle, Info, X, Phone, MapPin, Search, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function Bursaries() {
  const { user } = useAuth();
  const [bursaries, setBursaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasOwnPosts, setHasOwnPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaculty, setActiveFaculty] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [infoDialog, setInfoDialog] = useState(null);

  useEffect(() => {
    api.get("/bursaries/faculties")
      .then(res => setFaculties(res.data || []))
      .catch(console.error);
    fetchBursaries();
    checkOwnPosts();
  }, [user]);

  useEffect(() => {
    fetchBursaries();
  }, [activeFaculty, searchQuery]);

  const fetchBursaries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFaculty) params.faculty = activeFaculty;
      if (searchQuery) params.search = searchQuery;
      const { data } = await api.get("/bursaries", { params });
      setBursaries(data || []);
    } catch (err) {
      console.error("Failed to fetch bursaries", err);
    } finally {
      setLoading(false);
    }
  };

  const checkOwnPosts = async () => {
    if (!user) return;
    try {
      const res = await api.get("/bursaries/my-count");
      setHasOwnPosts(res.data.count > 0);
    } catch (err) {
      setHasOwnPosts(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-semibold">Bursaries & Scholarships</h1>
          <div className="flex gap-2">
            {hasOwnPosts && (
              <Link to="/bursaries/my-posts" className="neo-btn neo-btn-secondary !px-4 !py-2">
                <Edit3 className="w-4 h-4 mr-2" />
                My Posts
              </Link>
            )}
            <Link to="/bursaries/create" className="neo-btn bg-purple-600 border-purple-600 !px-4 !py-2">
              <Plus className="w-4 h-4 mr-2" />
              Post Opportunity
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Faculty filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveFaculty("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${
              activeFaculty === "" ? "bg-purple-600 text-white border-purple-600" : "bg-white border-[#E7E5E0]"
            }`}
          >
            All
          </button>
          {faculties.map(fac => (
            <button
              key={fac}
              onClick={() => setActiveFaculty(fac)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${
                activeFaculty === fac ? "bg-purple-600 text-white border-purple-600" : "bg-white border-[#E7E5E0]"
              }`}
            >
              {fac.replace("Faculty of ", "")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : bursaries.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">No opportunities posted yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bursaries.map(item => {
              const isOwner = user?.user_id === item.user_id;
              return (
                <div key={item.bursary_id} className="bg-white border border-[#E7E5E0] rounded-xl overflow-hidden shadow-sm">
                  {/* Image – well handled with object-contain */}
                  <div className="relative w-full bg-[#F5F3EE]" style={{ paddingBottom: '75%' }}>
                    {item.image ? (
                      <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-contain p-2" />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center text-4xl">🎓</div>
                    )}
                    {/* Info icon */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setInfoDialog(item); }}
                      className="absolute top-2 left-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-sm leading-tight truncate">{item.title}</h3>

                    {/* Faculty tags */}
                    {item.faculties && item.faculties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.faculties.map(fac => (
                          <span key={fac} className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">
                            {fac.replace("Faculty of ", "")}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      {item.link ? (
                        <a
                          href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Learn more
                        </a>
                      ) : <span />}
                      <Link
                        to={`/bursaries/chat/${item.bursary_id}?other=${item.user_id}`}
                        className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Chat
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Dialog */}
      {infoDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setInfoDialog(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">{infoDialog.title}</h3>
              <button onClick={() => setInfoDialog(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            {infoDialog.description && (
              <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{infoDialog.description}</p>
            )}
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Posted by</p>
                <p className="text-sm">{infoDialog.seller_name || "Unknown"}</p>
              </div>
              {infoDialog.seller_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  <p className="text-sm">{infoDialog.seller_phone}</p>
                </div>
              )}
              {(infoDialog.seller_city || infoDialog.seller_country) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <p className="text-sm">
                    {[infoDialog.seller_city, infoDialog.seller_country].filter(Boolean).join(", ") || "No location"}
                  </p>
                </div>
              )}
              {infoDialog.link && (
                <div>
                  <a
                    href={infoDialog.link.startsWith('http') ? infoDialog.link : `https://${infoDialog.link}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View full details
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}