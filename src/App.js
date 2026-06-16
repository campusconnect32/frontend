import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import "@/App.css";

// Lazy‑load all page components
const Landing = React.lazy(() => import("@/pages/Landing"));
const ProfileSetup = React.lazy(() => import("@/pages/ProfileSetup"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const PrivacyPolicy = React.lazy(() => import("@/pages/PrivacyPolicy"));
const AcceptPrivacy = React.lazy(() => import("@/pages/AcceptPrivacy"));
const Signup = React.lazy(() => import("@/pages/Signup"));
const Login = React.lazy(() => import("@/pages/Login"));
const VerifyEmail = React.lazy(() => import("@/pages/VerifyEmail"));
const ForgotPassword = React.lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("@/pages/ResetPassword"));

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-[#6B6B70]">Loading…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Navigate to="/profile" replace />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/profile/setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/accept-privacy" element={<ProtectedRoute><AcceptPrivacy /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                border: "1px solid #E7E5E0",
                boxShadow: "0 4px 12px -4px rgba(15, 15, 16, 0.08), 0 2px 6px -1px rgba(15, 15, 16, 0.04)",
                borderRadius: "0.5rem",
                color: "#0F0F10",
                fontSize: "0.875rem",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}