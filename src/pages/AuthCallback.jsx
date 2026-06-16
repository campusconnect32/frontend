import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage - no more Emergent session_id
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white neo-border neo-shadow-lg rounded-lg px-8 py-6 font-display text-xl">
        Redirecting...
      </div>
    </div>
  );
}