import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { loginEmail } from '@/lib/api';
import { Loader2, ArrowRight, Building, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [university, setUniversity] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedUniversity');
    if (saved) {
      try {
        setUniversity(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing university:', e);
      }
    }
  }, []);

  const handleBackToUniversities = () => {
    localStorage.removeItem('selectedUniversity');
    navigate('/university-select');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginEmail(email, password);
      await refresh();
      toast.success('Logged in successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full relative">
        <button
          onClick={handleBackToUniversities}
          className="absolute top-4 left-4 text-gray-400 hover:text-[#1a237e] transition-colors flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h1 className="text-2xl font-bold text-[#1a237e] text-center mb-2">Welcome Back</h1>
        
        {university && (
          <div className="mt-2 flex items-center justify-center gap-2 bg-blue-50 rounded-lg px-4 py-2">
            <Building className="w-4 h-4 text-[#1a237e]" />
            <span className="text-sm font-medium text-[#1a237e]">{university.name}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-[#1a237e] hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#1a237e] hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
