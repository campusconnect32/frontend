import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupEmail } from "@/lib/api";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Read the university that was picked before signup
  const university = JSON.parse(localStorage.getItem("selectedUniversity"));
  const university_id = university?.id || null;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!university_id) {
      return toast.error("Please select your university first.");
    }

    if (!email || !password) return toast.error("Email and password required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password.length > 72) return toast.error("Password must be at most 72 characters");

    setLoading(true);
    try {
      // Pass university_id as the fourth argument
      await signupEmail(email, password, name || email.split("@")[0], university_id);
      toast.success("Account created! Check your email to verify.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#0F0F10] text-white rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6" fill="currentColor" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Create an account</h1>
          <p className="text-sm text-[#6B6B70] mt-1">
            {university
              ? `Joining ${university.name}`
              : "Join the campus community"}
          </p>
        </div>

        {/* Show a warning if no university is selected */}
        {!university_id && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-yellow-700">
            Please{" "}
            <Link to="/" className="font-semibold underline">
              choose your university
            </Link>{" "}
            before signing up.
          </div>
        )}

        <form onSubmit={handleSignup} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="neo-input mt-1"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="neo-input mt-1"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="neo-input mt-1"
              type="password"
              placeholder="At least 6 characters"
              maxLength={72}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !university_id}
            className="neo-btn bg-purple-600 border-purple-600 w-full"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-purple-600 hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}