import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const CheckEmail = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-10 h-10 text-[#1a237e]" />
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a237e] mb-2">Check Your Email</h1>
        <p className="text-gray-600 mb-4">
          We've sent a verification link to your email address.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            📧 Please check your inbox and click the verification link to activate your account.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Didn't receive the email? Check your spam folder.
          </p>
        </div>
        
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 bg-[#1a237e] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors"
        >
          <ArrowLeft size={18} />
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default CheckEmail;
