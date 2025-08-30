// src/components/Common/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaWater, FaChevronDown, FaMap, FaList, FaUsers, FaTachometerAlt, FaBook, FaCog, FaUserFriends, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';  // Fixed: Go up 2 directories

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const exploreDropdownRef = useRef(null);
  const communityDropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(event.target)) {
        setExploreDropdownOpen(false);
      }
      if (communityDropdownRef.current && !communityDropdownRef.current.contains(event.target)) {
        setCommunityDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setExploreDropdownOpen(false);
        setCommunityDropdownOpen(false);
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const exploreOptions = [
    { name: 'Map View', path: '/', icon: FaMap },
    { name: 'List View', path: '/dive-sites', icon: FaList },
  ];

  const communityOptions = [
    { name: 'Buddy Board', path: '/buddy-board', icon: FaUserFriends },
    { name: 'Find Partners', path: '/buddy-finder', icon: FaSearch },
  ];

  const accountOptions = [
    { name: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt },
    { name: 'Dive Logs', path: '/dive-logs', icon: FaBook },
    { name: 'Profile', path: '/profile', icon: FaUser },
  ];

  // Dynamic logo link based on authentication
  const logoLink = isAuthenticated ? '/dashboard' : '/';

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={logoLink} className="flex items-center space-x-2">
              <svg viewBox="0 0 28 28" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="10" cy="14" r="7" className="text-cyan-400" />
                <circle cx="18" cy="14" r="7" className="text-cyan-400" />
              </svg>
              <span className="text-white font-bold text-xl">BigBlue</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Explore Dropdown - Only show if authenticated */}
            {isAuthenticated && (
            <div className="relative" ref={exploreDropdownRef}>
              <button
                onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
                className="flex items-center space-x-1 text-white hover:text-cyan-400 transition-colors font-medium focus:outline-none"
              >
                <span>Explore</span>
                <FaChevronDown className={`text-sm transform transition-transform ${exploreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {exploreDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-xl z-50">
                  <div className="py-2">
                    {exploreOptions.map((option) => (
                      <Link
                        key={option.path}
                        to={option.path}
                        onClick={() => setExploreDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                      >
                        <option.icon className="text-cyan-400" />
                        <span>{option.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Community Dropdown - Only show if authenticated */}
            {isAuthenticated && (
            <div className="relative" ref={communityDropdownRef}>
              <button
                onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)}
                className="flex items-center space-x-1 text-white hover:text-cyan-400 transition-colors font-medium focus:outline-none"
              >
                <span>Community</span>
                <FaChevronDown className={`text-sm transform transition-transform ${communityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {communityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-xl z-50">
                  <div className="py-2">
                    {communityOptions.map((option) => (
                      <Link
                        key={option.path}
                        to={option.path}
                        onClick={() => setCommunityDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                      >
                        <option.icon className="text-cyan-400" />
                        <span>{option.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* My Account Dropdown - Only show if authenticated */}
            {isAuthenticated && (
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center space-x-1 text-white hover:text-cyan-400 transition-colors font-medium focus:outline-none"
                >
                  <span>My Account</span>
                  <FaChevronDown className={`text-sm transform transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {accountDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      {accountOptions.map((option) => (
                        <Link
                          key={option.path}
                          to={option.path}
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                        >
                          <option.icon className="text-cyan-400" />
                          <span>{option.name}</span>
                        </Link>
                      ))}
                      <div className="border-t border-slate-600/50 mt-2 pt-2">
                        <button
                          onClick={() => {
                            handleLogout();
                            setAccountDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-white hover:bg-red-500/20 hover:text-red-300 transition-colors"
                        >
                          <FaSignOutAlt className="text-red-400" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Authentication Links - Only show if not authenticated */}
            {!isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-cyan-400 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-cyan-400 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 border-t border-bright-aqua">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated && (
              <>
            {/* Mobile Explore Section */}
            <div className="border-b border-slate-700 pb-2 mb-2">
              <div className="px-3 py-2 text-cyan-400 font-semibold text-sm">
                Explore
              </div>
              {exploreOptions.map((option) => (
                <Link
                  key={option.path}
                  to={option.path}
                  className="block px-6 py-2 text-white hover:bg-cyan-500 hover:text-white rounded transition-colors flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <option.icon className="mr-3 text-cyan-400" />
                  {option.name}
                </Link>
              ))}
            </div>

            {/* Mobile Community Section */}
            <div className="border-b border-slate-700 pb-2 mb-2">
              <div className="px-3 py-2 text-cyan-400 font-semibold text-sm">
                Community
              </div>
              {communityOptions.map((option) => (
                <Link
                  key={option.path}
                  to={option.path}
                  className="block px-6 py-2 text-white hover:bg-cyan-500 hover:text-white rounded transition-colors flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <option.icon className="mr-3 text-cyan-400" />
                  {option.name}
                </Link>
              ))}
            </div>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                {/* Mobile My Account Section */}
                <div className="border-b border-slate-700 pb-2 mb-2">
                  <div className="px-3 py-2 text-cyan-400 font-semibold text-sm">
                    My Account
                  </div>
                  <div className="px-6 py-2 text-white text-sm bg-slate-700/50 rounded mx-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-cyan-400" />
                      <span>{user?.name || 'Diver'}</span>
                      <span className="text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">
                        {user?.certificationLevel || 'OW'}
                      </span>
                    </div>
                  </div>
                  {accountOptions.map((option) => (
                    <Link
                      key={option.path}
                      to={option.path}
                      className="block px-6 py-2 text-white hover:bg-cyan-500 hover:text-white rounded transition-colors flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <option.icon className="mr-3 text-cyan-400" />
                      {option.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-6 py-2 text-white hover:bg-red-500 rounded transition-colors flex items-center"
                  >
                    <FaSignOutAlt className="mr-3 text-red-400" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Mobile Authentication Links */}
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-white hover:bg-cyan-500 hover:text-white rounded transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;