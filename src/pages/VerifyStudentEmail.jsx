import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function VerifyStudentEmail() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (token && user) {
      api.post("/university/verify-email", { token })
        .then(() => {
          refresh();
          toast.success("Student email verified!");
          navigate("/profile/setup");
        })
        .catch(err => toast.error(err.response?.data?.detail || "Verification failed"));
    }
  }, [token, user]);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.student_email_verified) {
    navigate("/profile/setup");
    return null;
  }

  const handleSendVerification = async () => {
    if (!email.trim()) return toast.error("Enter your student email");
    setSending(true);
    try {
      await api.post("/university/send-verification", { student_email: email });
      toast.success("Verification email sent! Check your inbox.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not send verification");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="font-display text-2xl font-semibold mb-4">Verify Your Student Email</h1>
        <p className="text-sm text-gray-600 mb-6">
          {user.university_id
            ? `You are registered with ${user.university_id}. Please enter your student email to verify.`
            : "You haven't selected a university yet. Please select one first."}
        </p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="neo-input mt-1 mb-4"
          placeholder="s123456789@mandela.ac.za"
          type="email"
        />
        <button
          onClick={handleSendVerification}
          disabled={sending}
          className="neo-btn bg-purple-600 border-purple-600 w-full"
        >
          {sending ? "Sending..." : "Send Verification Email"}
        </button>
      </div>
    </div>
  );
}2