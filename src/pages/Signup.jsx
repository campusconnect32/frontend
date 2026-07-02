import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { signupEmail } from '@/lib/api';
import { Loader2, ArrowRight, AlertCircle, CheckCircle, Building, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { isValidUniversityEmail, getUniversityDomains } from '@/lib/universityEmailDomains';

const Signup = () => {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [university, setUniversity] = useState(null);
  const [emailValid, setEmailValid] = useState(false);
  const [domainInfo, setDomainInfo] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedUniversity');
    if (saved) {
      try {
        const uni = JSON.parse(saved);
        setUniversity(uni);
        const domains = getUniversityDomains(uni.id);
        if (domains) {
          setDomainInfo(domains);
        }
      } catch (e) {
        console.error('Error parsing university:', e);
      }
    } else {
      navigate('/university-select');
    }
  }, [navigate]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (university && value.includes('@')) {
      const isValid = isValidUniversityEmail(value, university.id);
      setEmailValid(isValid);
    } else {
      setEmailValid(false);
    }
  };

  const handleBackToUniversities = () => {
    localStorage.removeItem('selectedUniversity');
    navigate('/university-select');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailValid) {
      toast.error(`Please use a valid ${university?.name} student email`);
      return;
    }

    setLoading(true);
    try {
      // Pass university.id to signupEmail
      await signupEmail(email, password, name, university.id);
      await refresh();
      toast.success('Account created successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full relative">
        <button
          onClick={handleBackToUniversities}
          className="absolute top-4 left-4 text-gray-400 hover:text-[#1a237e] transition-colors flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a237e]">Create Account</h1>

          <div className="mt-3 flex items-center justify-center gap-2 bg-blue-50 rounded-lg px-4 py-2">
            <Building className="w-4 h-4 text-[#1a237e]" />
            <span className="text-sm font-medium text-[#1a237e]">{university.name}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] ${
                    email && emailValid ? 'border-green-500' : email && !emailValid ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={`e.g. student@${domainInfo?.domains?.[0] || 'university.ac.za'}`}
                />
                {email && emailValid && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                )}
                {email && !emailValid && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
                )}
              </div>
              {email && emailValid && (
                <p className="text-green-500 text-xs mt-1">✅ Valid {university.name} student email</p>
              )}
              {email && !emailValid && (
                <p className="text-red-500 text-xs mt-1">
                  ❌ Please use a valid {university.name} student email
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 6 characters)"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !emailValid}
              className="w-full bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1a237e] hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
