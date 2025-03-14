import React, { useState, useCallback, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

// Custom debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const debouncedSearchRef = useRef(null);

  // Initialize debounced search function
  useEffect(() => {
    debouncedSearchRef.current = debounce((query) => {
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        navigate('/');
      }
    }, 300);

    // Cleanup function
    return () => {
      if (debouncedSearchRef.current) {
        debouncedSearchRef.current.cancel?.();
      }
    };
  }, [navigate]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(query);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 shadow-xl shadow-black/50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <NavLink to="/" className="text-white font-bold text-xl md:text-2xl">
            MovieDB
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors z-50"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Search Bar - Hidden on mobile */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex flex-1 max-w-md mx-4"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for movies..."
              className="w-full px-4 py-2 rounded-full bg-black text-white border-2 border-white 
                focus:outline-none focus:border-white focus:ring-2 focus:ring-white 
                placeholder-gray-400 pl-10 transition-all duration-300"
            />
            <FaSearch className="absolute left-3 top-3 text-white" />
          </div>
        </form>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-white font-bold text-2xl"
                : "text-white/80 hover:text-white font-bold text-2xl transition-colors"
            }
          >
            Movies
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              isActive
                ? "text-white font-bold text-2xl"
                : "text-white/80 hover:text-white font-bold text-2xl transition-colors"
            }
          >
            Watchlist
          </NavLink>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`${
            isMenuOpen ? 'fixed' : 'hidden'
          } lg:hidden inset-0 bg-black/95 backdrop-blur-sm z-40 top-0 left-0 right-0 min-h-screen pt-20`}
        >
          <div className="flex flex-col items-center pt-8 h-full space-y-8 p-4">
            <form 
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-[280px] mx-auto"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for movies..."
                className="w-full px-4 py-2 rounded-full bg-black text-white border-2 border-white 
                  focus:outline-none focus:border-white focus:ring-2 focus:ring-white 
                  placeholder-gray-400 pl-10 transition-all duration-300"
              />
              <FaSearch className="absolute left-3 top-3 text-white" />
            </form>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 text-center ${isActive
                  ? "text-white font-bold text-2xl"
                  : "text-white/80 hover:text-white font-bold text-2xl transition-colors"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </NavLink>
            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                `block py-2 text-center ${isActive
                  ? "text-white font-bold text-2xl"
                  : "text-white/80 hover:text-white font-bold text-2xl transition-colors"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Watchlist
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
