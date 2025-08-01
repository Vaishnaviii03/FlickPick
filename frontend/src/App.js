// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Recommendation from "./components/Recommendation";
import Trending from "./components/Trending";
import Background from "./components/Background";
import BackgroundVideo from "./components/BackgroundVideo";
import WatchlistPage from "./components/WatchlistPage";
import MoviePage from "./components/MoviePage";
import IntroScreen from "./components/IntroScreen";
import "./App.css";

// Wrap the main content to handle intro screen logic
const MainContent = () => {
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if we've shown the intro before in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    // Only show intro on first visit to root path
    if (!hasSeenIntro && location.pathname === '/') {
      setShowIntro(true);
      // Don't mark as seen immediately - IntroScreen will handle this
    } else {
      setShowIntro(false);
    }
  }, [location]);

  return (
    <>
      {showIntro && <IntroScreen onComplete={() => {
        setShowIntro(false);
        sessionStorage.setItem('hasSeenIntro', 'true');
      }} />}
      
      <div className={`min-h-screen flex text-white overflow-x-hidden relative
        ${showIntro ? 'hidden' : 'animate-fadeIn'}`}>
        {/* Background Layers */}
        <BackgroundVideo />
        <Background />

        {/* Main Content */}
        <div className="flex-1 relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(17, 25, 40, 0.75)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.125)',
              },
            }}
          />

          <div className="flex-1 page-transition">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/movie/:movieId" element={<MoviePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </div>

          {/* Footer */}
          <footer className="relative z-10 backdrop-blur-sm bg-dark-900/50 border-t border-white/10">
            <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
              <p>© 2025 FlickPick by Vaishnavi Pandey. All Rights Reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

function Home() {
  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      {/* Header with title and tagline */}
      <header className="relative w-full py-8 px-4 text-center">
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
              FlickPick
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide mb-8 animate-fade-in-up">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Discover your next favorite movie with AI-powered recommendations
            </span>
          </p>
        </div>
      </header>

      {/* Main content with recommendations */}
      <main className="container mx-auto px-4 pb-12 w-full max-w-7xl">
        <div className="glass-morphism p-8 md:p-10 rounded-2xl shadow-xl">
          <Recommendation />
        </div>
      </main>
    </div>
  );
}

function TrendingPage() {
  return (
    <div className="container mx-auto px-4 py-16 animate-slide-up">
      <div className="glass-card p-6 md:p-8">
      <Trending layout="vertical" />
      </div>
    </div>
  );
}

function BrowsePage() {
  return (
    <div className="container mx-auto px-4 py-16 animate-slide-up">
      <div className="glass-card p-6 md:p-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3">🎞️</span>Browse
        </h2>
      <p className="text-gray-400">Browse feature coming soon…</p>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 animate-slide-up">
      <div className="glass-card p-6 md:p-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3">📖</span>About FlickPick
        </h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed">
        FlickPick is your personal movie concierge—melding collaborative
        filtering with content‑based models to surface the perfect film for
        every mood.
      </p>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 animate-slide-up">
      <div className="glass-card p-6 md:p-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3">✉️</span>Contact Us
        </h2>
        <p className="text-gray-300 text-lg">
        Questions or feedback? Reach out at{" "}
        <a
          href="mailto:support@flickpick.example"
            className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
        >
          support@flickpick.example
        </a>
      </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  );
}

export default App;
