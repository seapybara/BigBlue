import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, BookOpen, MapPin, Shield, Award, ArrowRight, Menu, X, Play, Pause } from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Advanced Diver",
      content: "Found amazing dive buddies in Bali through BigBlue. The platform made it so easy to connect with experienced divers.",
      avatar: "SC"
    },
    {
      name: "Mike Rodriguez",
      role: "Beginner Diver",
      content: "As a new diver, BigBlue helped me find patient buddies who helped me build confidence underwater.",
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Dive Instructor",
      content: "BigBlue is perfect for coordinating group dives and meeting divers from around the world.",
      avatar: "ET"
    }
  ];

  const diveLocations = [
    { name: "Blue Hole, Belize", depth: "43m", level: "Advanced" },
    { name: "Great Barrier Reef", depth: "25m", level: "Beginner" },
    { name: "USS Liberty Wreck", depth: "30m", level: "Intermediate" },
    { name: "Sipadan Island", depth: "40m", level: "Intermediate" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Custom logo component for the interlocking rings
  const BuddyRingsLogo = () => (
    <svg viewBox="0 0 28 28" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3">
      <circle cx="10" cy="14" r="7" className="text-cyan-400" />
      <circle cx="18" cy="14" r="7" className="text-cyan-400" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md z-50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BuddyRingsLogo />
              <span className="text-2xl font-bold text-white">BigBlue</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#locations" className="text-gray-300 hover:text-white transition">Dive Sites</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
              <button 
                onClick={() => window.location.href = '/login'}
                className="text-white hover:text-cyan-400 transition"
              >
                Login
              </button>
              <button 
                onClick={() => window.location.href = '/signup'}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition transform hover:scale-105"
              >
                Sign Up Free
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-blue-500/20">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white">Features</a>
              <a href="#locations" className="block px-3 py-2 text-gray-300 hover:text-white">Dive Sites</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-300 hover:text-white">How It Works</a>
              <button 
                onClick={() => window.location.href = '/login'}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white"
              >
                Login
              </button>
              <button 
                onClick={() => window.location.href = '/signup'}
                className="block w-full text-left px-3 py-2 text-cyan-400 font-semibold"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Enhanced Ocean Effects - Updated Animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Enhanced Animated Ocean Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-blue-800/20"></div>
          
          {/* Animated bubbles - perfectly round */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => {
              const size = Math.random() * 40 + 15;
              return (
                <div
                  key={`bubble-${i}`}
                  className="absolute rounded-full bg-white/5 animate-float"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${Math.random() * 20 + 10}s`
                  }}
                />
              );
            })}
          </div>
          
          {/* Marine life - fish, turtles, sharks, divers */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Different types of fish */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`fish-${i}`}
                className="absolute animate-swim"
                style={{
                  top: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${Math.random() * 25}s`,
                  animationDuration: `${Math.random() * 30 + 60}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'linear'
                }}
              >
                {i % 3 === 0 ? (
                  // Tropical fish shape
                  <svg viewBox="0 0 60 40" className="fill-cyan-400/10" style={{ width: `${Math.random() * 30 + 25}px` }}>
                    <ellipse cx="25" cy="20" rx="20" ry="15" />
                    <path d="M5 20 L 0 10 L 0 30 Z" />
                    <circle cx="35" cy="18" r="2" className="fill-white/20" />
                  </svg>
                ) : i % 3 === 1 ? (
                  // Regular fish shape
                  <svg viewBox="0 0 50 30" className="fill-blue-300/10" style={{ width: `${Math.random() * 35 + 20}px` }}>
                    <ellipse cx="30" cy="15" rx="18" ry="10" />
                    <path d="M12 15 L 2 10 L 2 20 Z" />
                    <circle cx="38" cy="12" r="1.5" className="fill-white/20" />
                  </svg>
                ) : (
                  // School of small fish
                  <svg viewBox="0 0 80 30" className="fill-blue-400/10" style={{ width: `${Math.random() * 40 + 30}px` }}>
                    <ellipse cx="10" cy="15" rx="8" ry="4" />
                    <path d="M2 15 L -3 12 L -3 18 Z" />
                    <ellipse cx="25" cy="12" rx="8" ry="4" />
                    <path d="M17 12 L 12 9 L 12 15 Z" />
                    <ellipse cx="40" cy="18" rx="8" ry="4" />
                    <path d="M32 18 L 27 15 L 27 21 Z" />
                    <ellipse cx="55" cy="14" rx="8" ry="4" />
                    <path d="M47 14 L 42 11 L 42 17 Z" />
                  </svg>
                )}
              </div>
            ))}
            
            {/* Sea turtles */}
            {[...Array(2)].map((_, i) => (
              <div
                key={`turtle-${i}`}
                className="absolute animate-swim-slow"
                style={{
                  top: `${Math.random() * 50 + 25}%`,
                  animationDelay: `${Math.random() * 35}s`,
                  animationDuration: '80s',
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'linear'
                }}
              >
                <svg viewBox="0 0 120 90" className="fill-green-600/15" style={{ width: '110px' }}>
                  {/* Shell - more oval and detailed */}
                  <ellipse cx="60" cy="45" rx="35" ry="28" className="fill-green-600/15" />
                  {/* Shell segments */}
                  <path d="M35 30 Q 45 25, 55 30 Q 65 25, 75 30 Q 85 35, 85 45 Q 85 55, 75 60 Q 65 65, 55 60 Q 45 65, 35 60 Q 25 55, 25 45 Q 25 35, 35 30" 
                        className="stroke-green-700/20" strokeWidth="1.5" fill="none" />
                  <path d="M60 20 L 60 70 M 40 30 L 80 60 M 40 60 L 80 30" 
                        className="stroke-green-700/15" strokeWidth="1" />
                  {/* Head - more turtle-like */}
                  <ellipse cx="90" cy="45" rx="12" ry="10" className="fill-green-700/15" />
                  <circle cx="95" cy="42" r="1.5" className="fill-black/40" />
                  {/* Front flippers */}
                  <ellipse cx="30" cy="35" rx="15" ry="8" className="fill-green-700/15" transform="rotate(-30 30 35)" />
                  <ellipse cx="30" cy="55" rx="15" ry="8" className="fill-green-700/15" transform="rotate(30 30 55)" />
                  {/* Back flippers */}
                  <ellipse cx="20" cy="40" rx="8" ry="12" className="fill-green-700/15" />
                  <ellipse cx="20" cy="50" rx="8" ry="12" className="fill-green-700/15" />
                </svg>
              </div>
            ))}
            
            {/* Shark */}
            <div
              className="absolute animate-swim-slow"
              style={{
                top: '70%',
                animationDelay: '30s',
                animationDuration: '90s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear'
              }}
            >
              <svg viewBox="0 0 120 50" className="fill-gray-600/10" style={{ width: '110px' }}>
                {/* Body */}
                <ellipse cx="60" cy="25" rx="35" ry="12" />
                {/* Tail - proper shark tail */}
                <path d="M25 25 L 8 15 L 12 25 L 8 35 L 15 28 Z" />
                {/* Dorsal fin */}
                <path d="M55 13 L 65 5 L 70 13" />
                {/* Pectoral fins */}
                <path d="M75 28 L 85 35 L 75 32" />
                <path d="M75 22 L 85 15 L 75 18" />
                {/* Eye */}
                <circle cx="80" cy="22" r="2" className="fill-black/30" />
              </svg>
            </div>
            
            {/* Scuba divers - larger and properly oriented */}
            {[...Array(2)].map((_, i) => (
              <div
                key={`diver-${i}`}
                className="absolute animate-swim-diagonal"
                style={{
                  top: `${40 + i * 25}%`,
                  animationDelay: `${i * 45 + Math.random() * 10}s`,
                  animationDuration: '100s',
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'linear'
                }}
              >
                <svg viewBox="0 0 140 80" className="fill-gray-700/15" style={{ width: '330px', transform: 'scaleX(-1)' }}>
                  {/* Head with mask */}
                  <circle cx="25" cy="40" r="12" />
                  <rect x="18" y="35" width="14" height="10" rx="3" className="fill-cyan-400/15" />
                  {/* Body */}
                  <rect x="35" y="35" width="30" height="10" rx="3" />
                  {/* Arms */}
                  <rect x="40" y="28" width="18" height="5" rx="2" transform="rotate(15 40 30)" />
                  <rect x="40" y="47" width="18" height="5" rx="2" transform="rotate(-15 40 49)" />
                  {/* Legs with fins */}
                  <rect x="62" y="32" width="25" height="5" rx="2" />
                  <rect x="62" y="43" width="25" height="5" rx="2" />
                  <path d="M85 32 L 105 28 L 105 37 Z" className="fill-gray-600/15" />
                  <path d="M85 43 L 105 39 L 105 48 Z" className="fill-gray-600/15" />
                  {/* Tank - horizontal cylinder */}
                  <rect x="35" y="28" width="20" height="8" rx="2" className="fill-gray-500/30" />
                  {/* Regulator hose */}
                  <path d="M25 35 Q 30 32, 35 35" className="stroke-gray-400/20" strokeWidth="2" fill="none" />
                  {/* Bubbles from diver */}
                  <circle cx="22" cy="25" r="2.5" className="fill-white/15" />
                  <circle cx="18" cy="20" r="2" className="fill-white/15" />
                  <circle cx="25" cy="15" r="1.5" className="fill-white/15" />
                  <circle cx="20" cy="10" r="1" className="fill-white/15" />
                </svg>
              </div>
            ))}
          </div>
          
          {/* Seaweed/kelp at bottom with seahorses */}
          <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none">
            {/* Kelp forest */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`kelp-${i}`}
                className="absolute bottom-0 animate-sway"
                style={{
                  left: `${i * 8 + Math.random() * 4}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  height: `${Math.random() * 120 + 60}px`,
                  width: '3px',
                  background: `linear-gradient(to top, rgba(0,100,50,0.3), transparent)`,
                  borderRadius: '50% 50% 0 0',
                  transformOrigin: 'bottom center'
                }}
              />
            ))}
            
            {/* Seahorses around kelp */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`seahorse-${i}`}
                className="absolute animate-sway"
                style={{
                  bottom: `${Math.random() * 80 + 20}px`,
                  left: `${i * 20 + Math.random() * 10 + 10}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${Math.random() * 3 + 4}s`
                }}
              >
                <svg viewBox="0 0 30 50" className="fill-yellow-400/15" style={{ width: '20px' }}>
                  {/* Seahorse body - simplified S-curve */}
                  <path d="M15 8 Q 12 15, 15 22 Q 18 30, 15 38 Q 12 42, 15 45" strokeWidth="2.5" className="stroke-yellow-500/20" fill="none" />
                  {/* Head */}
                  <ellipse cx="15" cy="10" rx="3" ry="4" className="fill-yellow-400/20" />
                  {/* Snout */}
                  <rect x="18" y="9" width="6" height="2" rx="1" className="fill-yellow-500/20" />
                  {/* Dorsal fin - simplified */}
                  <path d="M13 12 Q 8 15, 13 20 Q 8 25, 13 30 Q 8 35, 13 40" strokeWidth="0.8" fill="none" className="stroke-yellow-300/25" />
                  {/* Tail - curled */}
                  <path d="M15 45 Q 12 48, 10 45 Q 8 42, 12 44" strokeWidth="1.5" fill="none" className="stroke-yellow-500/20" />
                  {/* Eye */}
                  <circle cx="16" cy="8" r="0.8" className="fill-black/50" />
                </svg>
              </div>
            ))}
            
            {/* Starfish on ocean floor */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`starfish-${i}`}
                className="absolute"
                style={{
                  bottom: '5px',
                  left: `${i * 30 + Math.random() * 15 + 15}%`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              >
                <svg viewBox="0 0 50 50" className="fill-purple-400/15" style={{ width: '30px' }}>
                  {/* 5 pointed starfish */}
                  <path d="M25 5 L 28 18 L 42 18 L 32 26 L 35 40 L 25 32 L 15 40 L 18 26 L 8 18 L 22 18 Z" />
                  {/* Center circle */}
                  <circle cx="25" cy="25" r="4" className="fill-purple-500/20" />
                  {/* Texture dots */}
                  <circle cx="25" cy="12" r="1" className="fill-purple-600/30" />
                  <circle cx="35" cy="22" r="1" className="fill-purple-600/30" />
                  <circle cx="30" cy="35" r="1" className="fill-purple-600/30" />
                  <circle cx="20" cy="35" r="1" className="fill-purple-600/30" />
                  <circle cx="15" cy="22" r="1" className="fill-purple-600/30" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Dive Into a World of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Connected Adventures
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
            Find your perfect dive buddy, explore 100+ world-class dive sites, and log your underwater adventures on our interactive 3D globe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delay-2">
            <button 
              onClick={() => window.location.href = '/signup'}
              className="group bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition transform hover:scale-105 flex items-center justify-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition border border-white/20"
            >
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400">100+</div>
              <div className="text-gray-400">Dive Sites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400">500+</div>
              <div className="text-gray-400">Active Divers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400">1000+</div>
              <div className="text-gray-400">Dives Logged</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-8 h-8 text-white/50 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> Safe Diving</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect, explore, and track your diving journey with powerful features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 hover:border-cyan-400/40 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Interactive 3D Globe</h3>
              <p className="text-gray-400 mb-4">
                Explore dive sites worldwide on our stunning 3D interactive map. Filter by difficulty, depth, and marine life.
              </p>
              <div className="text-cyan-400 flex items-center group-hover:translate-x-2 transition">
                View Demo <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 hover:border-cyan-400/40 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Buddy Matching</h3>
              <p className="text-gray-400 mb-4">
                Find certified dive buddies based on experience level, location, and diving interests. Never dive alone again.
              </p>
              <div className="text-cyan-400 flex items-center group-hover:translate-x-2 transition">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 hover:border-cyan-400/40 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Digital Dive Log</h3>
              <p className="text-gray-400 mb-4">
                Track your dives, log conditions, and build your diving portfolio. Share experiences with the community.
              </p>
              <div className="text-cyan-400 flex items-center group-hover:translate-x-2 transition">
                See Features <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dive Locations Preview */}
      <section id="locations" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover World-Class
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> Dive Sites</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From tropical reefs to historic wrecks, explore our curated collection of dive locations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diveLocations.map((location, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/20 hover:border-cyan-400/40 transition hover:transform hover:scale-105">
                <div className="h-32 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-cyan-400/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{location.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Max Depth: {location.depth}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      location.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      location.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {location.level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">And 8 more amazing locations waiting to be explored...</p>
            <button 
              onClick={() => window.location.href = '/signup'}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition transform hover:scale-105"
            >
              View All Locations
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Start Diving in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> 3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Create Your Profile</h3>
              <p className="text-gray-400">Sign up and add your certification level, experience, and diving preferences</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Find Your Buddy</h3>
              <p className="text-gray-400">Browse the buddy board or explore dive sites on our 3D globe to connect with divers</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Dive & Log</h3>
              <p className="text-gray-400">Plan your dive, meet your buddy, and log your underwater adventures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> Divers Worldwide</span>
            </h2>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                {testimonials[currentTestimonial].avatar}
              </div>
              <div>
                <h4 className="text-white font-semibold">{testimonials[currentTestimonial].name}</h4>
                <p className="text-gray-400 text-sm">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg italic">"{testimonials[currentTestimonial].content}"</p>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentTestimonial ? 'bg-cyan-400 w-8' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Explore the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> Underwater World?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join our growing community of divers and start your next adventure today
          </p>
          <button 
            onClick={() => window.location.href = '/signup'}
            className="group bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition transform hover:scale-105 inline-flex items-center"
          >
            Create Free Account
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
          <p className="text-gray-500 mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BuddyRingsLogo />
              <span className="text-2xl font-bold text-white">BigBlue</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500">
            © 2025 BigBlue. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.5;
          }
          33% {
            transform: translateY(-80px) rotate(120deg);
            opacity: 0.3;
          }
          66% {
            transform: translateY(-40px) rotate(240deg);
            opacity: 0.5;
          }
        }

        @keyframes swim {
          from {
            transform: translateX(-250px);
          }
          to {
            transform: translateX(calc(100vw + 250px));
          }
        }

        @keyframes swim-slow {
          from {
            transform: translateX(-250px);
          }
          to {
            transform: translateX(calc(100vw + 250px));
          }
        }

        @keyframes swim-diagonal {
          0% {
            transform: translateX(-250px) translateY(0px);
          }
          50% {
            transform: translateX(calc(50vw - 125px)) translateY(-20px);
          }
          100% {
            transform: translateX(calc(100vw + 250px)) translateY(0px);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-swim {
          animation: swim linear infinite;
        }

        .animate-swim-slow {
          animation: swim-slow linear infinite;
        }

        .animate-swim-diagonal {
          animation: swim-diagonal ease-in-out infinite;
        }

        .animate-sway {
          animation: sway ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;