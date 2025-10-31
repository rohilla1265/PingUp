import React from 'react';
import { assets } from '../src/assets/assets';
import { Star } from 'lucide-react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-black">
      
      {/* Background Image */}
      <img 
        src={assets.bgImage} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
      />

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/40 via-indigo-500/20 to-cyan-400/20 animate-pulse"></div>

      {/* Center Content */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col md:flex-row items-center md:justify-between px-8 py-20 gap-12">
        
        {/* Left Section */}
        <div className="text-center md:text-left max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-400 drop-shadow-2xl">
            Connect. Collaborate. Create.
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            Build real connections on 
            <span className="text-cyan-300 font-semibold">Ping Up</span> — your gateway to a thriving global network.
          </p>

          {/* Rating Display */}
          <div className="flex items-center space-x-3 mt-6">
            <div className="flex space-x-1 bg-white/80 px-3 py-2 rounded-full shadow-lg backdrop-blur-xl">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <p className="text-white text-base font-semibold bg-black/30 backdrop-blur-md rounded-full px-5 py-2">
              Trusted by 12M+ users
            </p>
          </div>
        </div>

        {/* Right Section (Glass Card) */}
        <div className="w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 hover:scale-[1.02] transform transition-all duration-500">
          
          {/* App Logo */}
          <div className="flex justify-center mb-6">
            <img src={assets.logo} alt="App Logo" className="h-14 w-auto drop-shadow-lg" />
          </div>
          
          {/* Clerk Sign In */}
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                header: "text-center",
                headerTitle: "text-white text-2xl font-bold",
                headerSubtitle: "text-white/70 mb-4",
                socialButtons: "space-y-3",
                socialButtonsBlockButton: "bg-white/90 hover:bg-white text-gray-800 font-medium border border-white/30 rounded-lg transition-all duration-300",
                dividerLine: "bg-white/20",
                dividerText: "text-white/90 font-medium",
                formFieldLabel: "text-white/90 font-medium tracking-wide",
                formFieldInput:
                  "bg-white/20 text-white placeholder-white/60 rounded-lg border border-white/30 focus:border-cyan-400 focus:ring-cyan-400 outline-none py-3",
                formButtonPrimary:
                  "mt-4 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300",
                footer: "text-center mt-4",
                footerActionText: "text-white/70",
                footerActionLink: "text-cyan-300 hover:text-cyan-200 font-semibold",
              },
            }}
          />
        </div>
      </div>

      {/* Floating Animated Circle Backgrounds */}
      <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-32 -right-20 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
};

export default Login;
