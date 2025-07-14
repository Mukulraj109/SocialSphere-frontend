import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${
              i % 4 === 0 ? 'w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400' :
              i % 4 === 1 ? 'w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400' :
              i % 4 === 2 ? 'w-1 h-1 bg-gradient-to-r from-pink-400 to-rose-400' :
              'w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Registration Form */}
          <div className="flex justify-center lg:justify-start">
            <div className="transform perspective-1000 rotate-y-[-12deg] hover:rotate-y-0 transition-transform duration-700 hover:scale-105">
              <RegisterForm />
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">Revolution</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
              Connect with millions of users and discover amazing content in our next-generation social platform
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-gray-300">Share unlimited content</span>
              </div>
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse delay-200 shadow-lg"></div>
                <span className="text-gray-300">Build your community</span>
              </div>
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse delay-400 shadow-lg"></div>
                <span className="text-gray-300">AI-powered recommendations</span>
              </div>
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse delay-600 shadow-lg"></div>
                <span className="text-gray-300">Real-time interactions</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
              <p className="text-gray-300">
                Join millions of users who are already connecting and sharing on SocialSphere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;