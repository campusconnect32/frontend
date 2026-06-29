import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function MyNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notes")
      .then(res => {
        const all = res.data || [];
        setNotes(all.filter(note => note.user_id === user?.user_id));
      })
      .catch(err => {
        console.error("Failed to load notes", err);
        toast.error("Could not load your notes");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(prev => prev.filter(note => note.note_id !== noteId));
      toast.success("Note deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-semibold mb-6">My Notes</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">
            You haven't posted any notes yet.
            <br />
            <Link to="/notes/create" className="text-purple-600 font-medium underline">
              Create your first note listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => {
              const images = note.images?.length ? note.images : [];
              return (
                <div key={note.note_id} className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-video bg-[#F5F3EE]">
                    {images[0] ? (
                      <img src={images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-base leading-tight">{note.title}</h3>
                    <p className="text-sm text-[#6B6B70] mt-1">{note.course_name} – {note.course_code}</p>
                    <p className="text-sm font-medium mt-1">{note.price}</p>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-[#E7E5E0]">
                      <Link to={`/notes/edit/${note.note_id}`} className="neo-btn neo-btn-secondary !py-1.5 !px-3 text-xs">
                        <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(note.note_id)}
                        className="neo-btn !py-1.5 !px-3 text-xs bg-red-500 border-red-500 text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}