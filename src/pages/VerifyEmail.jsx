import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "@/lib/api";
import { toast } from "sonner";
import { Heart, CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }
    verifyEmail(token)
      .then(data => {
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      })
      .catch(err => {
        setStatus("error");
        setMessage(err.response?.data?.detail || "Verification failed.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-12 h-12 bg-[#0F0F10] text-white rounded-xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6" fill="currentColor" />
        </div>

        {status === "loading" && (
          <>
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#6B6B70]">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold mb-2">Email Verified!</h1>
            <p className="text-sm text-[#6B6B70] mb-6">{message}</p>
            <Link to="/login" className="neo-btn bg-purple-600 border-purple-600">
              Log In
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold mb-2">Verification Failed</h1>
            <p className="text-sm text-[#6B6B70] mb-6">{message}</p>
            <Link to="/signup" className="neo-btn bg-purple-600 border-purple-600">
              Sign Up Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}