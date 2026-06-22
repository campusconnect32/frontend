import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import "@/App.css";

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
const Tutors = React.lazy(() => import("@/pages/Tutors"));
const TutorCreate = React.lazy(() => import("@/pages/TutorCreate"));
const TutorEdit = React.lazy(() => import("@/pages/TutorEdit"));
const MyTutorAds = React.lazy(() => import("@/pages/MyTutorAds"));
const TutorReviews = React.lazy(() => import("@/pages/TutorReviews"));
const Market = React.lazy(() => import("@/pages/Market"));
const MarketCreate = React.lazy(() => import("@/pages/MarketCreate"));
const MarketDetail = React.lazy(() => import("@/pages/MarketDetail"));
const MarketEdit = React.lazy(() => import("@/pages/MarketEdit"));
const MyMarketListings = React.lazy(() => import("@/pages/MyMarketListings"));
const MyMarketCustomers = React.lazy(() => import("@/pages/MyMarketCustomers"));
const CustomerDetail = React.lazy(() => import("@/pages/CustomerDetail"));
const MarketChat = React.lazy(() => import("@/pages/MarketChat"));
const Clubs = React.lazy(() => import("@/pages/Clubs"));
const ClubCreate = React.lazy(() => import("@/pages/ClubCreate"));
const ClubDetail = React.lazy(() => import("@/pages/ClubDetail"));
const ClubChat = React.lazy(() => import("@/pages/ClubChat"));
const Quiz = React.lazy(() => import("@/pages/Quiz"));
const Bursaries = React.lazy(() => import("@/pages/Bursaries"));
const BursaryCreate = React.lazy(() => import("@/pages/BursaryCreate"));
const BursaryEdit = React.lazy(() => import("@/pages/BursaryEdit"));
const MyBursaries = React.lazy(() => import("@/pages/MyBursaries"));
const Stories = React.lazy(() => import("@/pages/Stories"));
const FindUsers = React.lazy(() => import("@/pages/FindUsers"));
const LostFound = React.lazy(() => import("@/pages/LostFound"));
const Directions = React.lazy(() => import("@/pages/Directions"));
const Events = React.lazy(() => import("@/pages/Events"));
const Announcements = React.lazy(() => import("@/pages/Announcements"));

function AuthOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-sm text-[#6B6B70]">Loading…</div></div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = window.location.pathname;
  
  // List of public routes that should NOT redirect to profile setup
  const publicRoutes = ['/announcements', '/events', '/quiz', '/lost-found', '/directions'];
  
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-sm text-[#6B6B70]">Loading…</div></div>;
  if (!user) return <Navigate to="/" replace />;
  
  // Skip profile redirect for public routes
  if (publicRoutes.includes(location)) {
    return children;
  }
  
  if (user.onboarding_complete === false) return <Navigate to="/profile/setup" replace />;
  return children;
}

function AppRouter() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Navigate to="/profile" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/profile/setup" element={<AuthOnlyRoute><ProfileSetup /></AuthOnlyRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/accept-privacy" element={<ProtectedRoute><AcceptPrivacy /></ProtectedRoute>} />

        {/* Stories */}
        <Route path="/stories" element={<AuthOnlyRoute><Stories /></AuthOnlyRoute>} />
        <Route path="/stories/find" element={<AuthOnlyRoute><FindUsers /></AuthOnlyRoute>} />

        {/* Tutors */}
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tutors/create" element={<AuthOnlyRoute><TutorCreate /></AuthOnlyRoute>} />
        <Route path="/tutors/myads" element={<AuthOnlyRoute><MyTutorAds /></AuthOnlyRoute>} />
        <Route path="/tutors/:tutorId/reviews" element={<TutorReviews />} />
        <Route path="/tutors/edit/:tutorId" element={<AuthOnlyRoute><TutorEdit /></AuthOnlyRoute>} />

        {/* Market */}
        <Route path="/market" element={<Market />} />
        <Route path="/market/create" element={<AuthOnlyRoute><MarketCreate /></AuthOnlyRoute>} />
        <Route path="/market/mylistings" element={<AuthOnlyRoute><MyMarketListings /></AuthOnlyRoute>} />
        <Route path="/market/mycustomers" element={<AuthOnlyRoute><MyMarketCustomers /></AuthOnlyRoute>} />
        <Route path="/market/customer/:customerId" element={<AuthOnlyRoute><CustomerDetail /></AuthOnlyRoute>} />
        <Route path="/market/chat/:itemId" element={<AuthOnlyRoute><MarketChat /></AuthOnlyRoute>} />
        <Route path="/market/:itemId" element={<MarketDetail />} />
        <Route path="/market/edit/:itemId" element={<AuthOnlyRoute><MarketEdit /></AuthOnlyRoute>} />

        {/* Clubs */}
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/clubs/create" element={<AuthOnlyRoute><ClubCreate /></AuthOnlyRoute>} />
        <Route path="/clubs/:clubId" element={<AuthOnlyRoute><ClubDetail /></AuthOnlyRoute>} />
        <Route path="/clubs/:clubId/chat" element={<AuthOnlyRoute><ClubChat /></AuthOnlyRoute>} />

        {/* Bursaries */}
        <Route path="/bursaries" element={<Bursaries />} />
        <Route path="/bursaries/create" element={<AuthOnlyRoute><BursaryCreate /></AuthOnlyRoute>} />
        <Route path="/bursaries/my-posts" element={<AuthOnlyRoute><MyBursaries /></AuthOnlyRoute>} />
        <Route path="/bursaries/edit/:bursaryId" element={<AuthOnlyRoute><BursaryEdit /></AuthOnlyRoute>} />

	{/* Lost and found */}
	<Route path="/lost-found" element={<LostFound />} />

	{/* Directions */}
	<Route path="/directions" element={<Directions />} />
        {/* Quizzes */}
        <Route path="/quiz" element={<Quiz />} />
	
	<Route path="/events" element={<Events />} />
	<Route path="/announcements" element={<Announcements />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />
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
          <Toaster position="top-right" toastOptions={{ style: { background: "#FFFFFF", border: "1px solid #E7E5E0", boxShadow: "0 4px 12px -4px rgba(15, 15, 16, 0.08), 0 2px 6px -1px rgba(15, 15, 16, 0.04)", borderRadius: "0.5rem", color: "#0F0F10", fontSize: "0.875rem" }}} />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
