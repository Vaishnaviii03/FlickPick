import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IntroScreen = ({ onComplete }) => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Redirect to home after animations complete
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(() => {
        if (onComplete) onComplete();
        navigate('/');
      }, 1000); // Longer fade out animation
    }, 6000); // Increased total animation duration

    return () => clearTimeout(timer);
  }, [navigate, onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center
      ${animationComplete ? 'animate-fadeOut' : ''}`}
      style={{ animationDuration: '1s' }} // Slower fade out
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-400/20 animate-pulse" 
             style={{ animationDuration: '3s' }} />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            >
              <div
                className="w-1 h-1 bg-white rounded-full"
                style={{
                  transform: `scale(${Math.random() * 2 + 0.5})`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Animated gradient rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[600px] h-[600px] border border-primary-500/20 rounded-full animate-spin-slow"
              style={{
                animationDuration: `${20 + i * 5}s`,
                transform: `scale(${0.7 + i * 0.15})`,
                opacity: 0.1 + i * 0.05,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Film Reel Animation */}
        <div className="mb-8 animate-spin-slow" style={{ animationDuration: '8s' }}>
          <svg
            className="w-20 h-20 mx-auto text-primary-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" className="animate-pulse" style={{ animationDuration: '2s' }} />
            <circle cx="12" cy="12" r="4" />
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx={12 + 7 * Math.cos((i * Math.PI) / 4)}
                cy={12 + 7 * Math.sin((i * Math.PI) / 4)}
                r="1"
              />
            ))}
          </svg>
        </div>

        {/* Logo Animation */}
        <h1 className="text-7xl font-black mb-4 animate-scaleIn opacity-0"
            style={{ 
              fontFamily: "'Audiowide', cursive", 
              animationDelay: '2s',
              textShadow: '0 0 20px rgba(255, 15, 123, 0.5)'
            }}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600">
            FlickPick
          </span>
        </h1>

        {/* Tagline Animation */}
        <p className="text-2xl text-gray-300 animate-slideUp opacity-0"
           style={{ 
             animationDelay: '2.5s',
             textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
           }}>
          Your Personal Movie Concierge
        </p>

        {/* Decorative Lines */}
        <div className="mt-8 flex justify-center gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-1 bg-gradient-to-r from-primary-500/80 to-primary-400/80 rounded-full animate-expandLine opacity-0"
              style={{ 
                animationDelay: `${3 + i * 0.2}s`,
                boxShadow: '0 0 10px rgba(255, 15, 123, 0.3)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroScreen; 