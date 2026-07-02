import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-[#1a237e]">📞 Contact Support</h1>
          </div>
          
          <p className="text-gray-600 mb-6">
            Need to change your university? Contact our support team and we'll help you out.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Mail className="w-5 h-5 text-[#1a237e]" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a href="mailto:support@campusconnect.co.za" className="text-sm text-[#1a237e] hover:underline">
                  support@campusconnect.co.za
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Phone className="w-5 h-5 text-[#1a237e]" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <a href="tel:+27111234567" className="text-sm text-[#1a237e] hover:underline">
                  +27 11 123 4567
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <MessageCircle className="w-5 h-5 text-[#1a237e]" />
              <div>
                <p className="text-sm font-medium">WhatsApp</p>
                <a href="https://wa.me/27811234567" className="text-sm text-[#1a237e] hover:underline">
                  081 123 4567
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              ⚠️ Please note: University changes require verification and may take up to 24 hours.
            </p>
          </div>
          
          <Link to="/" className="inline-block mt-6 text-sm text-[#1a237e] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Support;
