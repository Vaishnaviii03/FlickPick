// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic classes for active vs. inactive links
  const navClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive
        ? "text-white font-medium bg-gradient-to-r from-primary-500/30 to-primary-400/30 shadow-lg shadow-primary-500/20 border border-primary-500/30"
        : "text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-primary-500/10"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-dark-900/80 shadow-lg shadow-black/20 border-b border-white/10"
          : "backdrop-blur-lg bg-gradient-to-b from-dark-900/90 to-dark-900/70 border-b border-white/5"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-transparent to-primary-400/10"></div>
      
      <nav className="container mx-auto flex items-center justify-between px-4 py-4 relative">
        {/* Logo / Brand */}
        <NavLink
          to="/"
          end
          className="text-2xl font-extrabold text-white flex items-center group relative"
        >
          <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200 animate-pulse">
            🎬
          </span>
          <span className="ml-2 font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 animate-pulse">
            FlickPick
          </span>
          <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-primary-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-3 text-sm">
          <li>
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/browse" className={navClass}>
              Browse
            </NavLink>
          </li>
          <li>
            <NavLink to="/trending" className={navClass}>
              Trending
            </NavLink>
          </li>
          <li>
            <NavLink to="/watchlist" className={navClass}>
              Watchlist
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden fixed inset-0 z-50 transform ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-500 ease-in-out`}
        >
          <div className="absolute inset-0 bg-dark-900/98 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-400/5"></div>
            <div className="flex flex-col p-6">
              <div className="flex justify-between items-center mb-8">
                <NavLink
                  to="/"
                  end
                  className="text-2xl font-extrabold text-white flex items-center group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">
                    🎬
                  </span>
                  <span className="ml-2 font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600">
                    FlickPick
                  </span>
                </NavLink>
                <button
                  className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <ul className="flex flex-col gap-3">
                <li className="w-full">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `block w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-white font-medium bg-gradient-to-r from-primary-500/20 to-primary-400/20 shadow-lg shadow-primary-500/10 border border-primary-500/20"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/browse"
                    className={({ isActive }) =>
                      `block w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-white font-medium bg-gradient-to-r from-primary-500/20 to-primary-400/20 shadow-lg shadow-primary-500/10 border border-primary-500/20"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/trending"
                    className={({ isActive }) =>
                      `block w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-white font-medium bg-gradient-to-r from-primary-500/20 to-primary-400/20 shadow-lg shadow-primary-500/10 border border-primary-500/20"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Trending
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/watchlist"
                    className={({ isActive }) =>
                      `block w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-white font-medium bg-gradient-to-r from-primary-500/20 to-primary-400/20 shadow-lg shadow-primary-500/10 border border-primary-500/20"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Watchlist
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `block w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-white font-medium bg-gradient-to-r from-primary-500/20 to-primary-400/20 shadow-lg shadow-primary-500/10 border border-primary-500/20"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `block w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-white font-medium bg-gradient-to-r from-primary-500/20 to-primary-400/20 shadow-lg shadow-primary-500/10 border border-primary-500/20"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
