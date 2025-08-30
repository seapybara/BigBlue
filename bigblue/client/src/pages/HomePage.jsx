// HomePage Component - Updated hero card styling and debugging markers
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import DiveMap from '../components/Map/DiveMap';
import MapFilters from '../components/Map/MapFilters';
import LandingPage from '../components/LandingPage'; // Import the landing page
import { locationAPI } from '../services/api';
import { FaCompass, FaUserFriends } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); // Get auth state
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: [],
    features: [],
    depthRange: '',
    search: ''
  });

  // Fetch locations on mount ONLY if user is authenticated
  useEffect(() => {
    if (user) {
      fetchLocations();
    } else {
      setLoading(false); // Stop loading if no user
    }
  }, [user]);

  // Apply filters whenever filters or locations change
  useEffect(() => {
    if (user) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, locations]);

  const fetchLocations = async () => {
    try {
      const response = await locationAPI.getAll();
      console.log('Fetched locations:', response.data); // Debug log
      const locationData = response.data.data || [];
      setLocations(locationData);
      setFilteredLocations(locationData);
    } catch (error) {
      console.error('Error fetching locations:', error); // Debug log
      toast.error('Failed to load dive locations');
      setLocations([]);
      setFilteredLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...locations];

    // Apply difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(loc => 
        filters.difficulty.includes(loc.difficulty)
      );
    }

    // Apply features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(loc => 
        filters.features.some(feature => loc.features?.includes(feature))
      );
    }

    // Apply depth filter
    if (filters.depthRange) {
      const [min, max] = filters.depthRange.split('-').map(Number);
      filtered = filtered.filter(loc => 
        loc.depth.min >= min && loc.depth.max <= max
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(loc => 
        loc.name.toLowerCase().includes(searchLower) ||
        loc.country.toLowerCase().includes(searchLower) ||
        loc.region.toLowerCase().includes(searchLower) ||
        loc.marineLife?.some(species => species.toLowerCase().includes(searchLower))
      );
    }

    setFilteredLocations(filtered);
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    navigate(`/locations/${location._id}`);
  };

  const handleFilterChange = (newFilters) => {
    console.log('Filter change:', newFilters);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      difficulty: [],
      features: [],
      depthRange: '',
      search: ''
    });
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
        <div className="text-center">
          <svg viewBox="0 0 28 28" className="w-16 h-16 animate-bounce mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="10" cy="14" r="7" className="text-cyan-400" />
            <circle cx="18" cy="14" r="7" className="text-cyan-400" />
          </svg>
          <h2 className="text-2xl text-white font-semibold">Loading BigBlue...</h2>
        </div>
      </div>
    );
  }

  // If not authenticated, show the landing page
  if (!user) {
    return <LandingPage />;
  }

  // Show loading while fetching locations (only for authenticated users)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
        <div className="text-center">
          <svg viewBox="0 0 28 28" className="w-16 h-16 animate-bounce mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="10" cy="14" r="7" className="text-cyan-400" />
            <circle cx="18" cy="14" r="7" className="text-cyan-400" />
          </svg>
          <h2 className="text-2xl text-white font-semibold">Loading dive sites...</h2>
        </div>
      </div>
    );
  }

  // Authenticated user sees the map
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Hero Section - Overlaid on map - Updated styling */}
      <div className="absolute top-20 left-4 z-10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/20 rounded-lg shadow-xl p-6 max-w-md">
        <div className="flex items-center space-x-3 mb-4">
          <FaCompass className="text-4xl text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">BigBlue</h1>
            <p className="text-gray-300">Welcome back, {user.name || 'Diver'}!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{locations.length || 95}</div>
            <div className="text-xs text-gray-400">Dive Sites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">60</div>
            <div className="text-xs text-gray-400">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">147</div>
            <div className="text-xs text-gray-400">Active Buddies</div>
          </div>
        </div>

        <button
          onClick={() => navigate('/buddy-board')}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <FaUserFriends />
          <span>Find a Dive Buddy</span>
        </button>
        
        {/* Debug info */}
        {!process.env.REACT_APP_MAPBOX_TOKEN && (
          <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
            ⚠️ Mapbox token not found. Please add REACT_APP_MAPBOX_TOKEN to your .env file
          </div>
        )}
      </div>

      {/* Filters Sidebar */}
      {!loading && (
        <div className={`absolute top-20 right-4 z-10 transition-transform duration-300 ${
          showFilters ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute -left-10 top-0 bg-white rounded-l-lg shadow-lg p-2 hover:bg-gray-100"
            >
              {showFilters ? '→' : '←'}
            </button>
            <div className="w-80 max-h-[calc(100vh-120px)] overflow-y-auto">
              <MapFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                locationCount={filteredLocations.length}
              />
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="absolute inset-0">
        {!loading && filteredLocations.length > 0 ? (
          <DiveMap
            locations={filteredLocations}
            onLocationClick={handleLocationClick}
            selectedLocation={selectedLocation}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
            {loading ? (
              <div className="text-center">
                <svg viewBox="0 0 28 28" className="w-16 h-16 animate-bounce mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="10" cy="14" r="7" className="text-cyan-400" />
                  <circle cx="18" cy="14" r="7" className="text-cyan-400" />
                </svg>
                <p className="text-xl text-gray-600">Loading dive sites...</p>
              </div>
            ) : (
              <p className="text-xl text-white">No dive sites found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;