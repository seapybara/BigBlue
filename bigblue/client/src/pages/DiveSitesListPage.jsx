import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaWater, FaStar, FaThermometerHalf, FaEye, FaMap, FaList, FaFilter, FaTimes, FaSearch, FaHeart, FaRegHeart } from 'react-icons/fa';
import { locationAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { getDifficultyBadgeClasses, difficultyOrder } from '../utils/difficultyUtils';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';
import GradientCard from '../components/Common/GradientCard';

const DiveSitesListPage = () => {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: [],
    features: [],
    countries: [],
    depthRange: '',
    sortBy: 'name'
  });
  const [availableCountries, setAvailableCountries] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [locations, searchTerm, filters]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationAPI.getAll();
      const locationData = response.data.data || [];
      setLocations(locationData);
      
      // Extract unique countries for filter
      const countries = [...new Set(locationData.map(loc => loc.country))].sort();
      setAvailableCountries(countries);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load dive sites');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...locations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(location =>
        filters.difficulty.includes(location.difficulty)
      );
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(location =>
        filters.features.some(feature => location.features?.includes(feature))
      );
    }

    // Country filter
    if (filters.countries.length > 0) {
      filtered = filtered.filter(location =>
        filters.countries.includes(location.country)
      );
    }

    // Depth range filter
    if (filters.depthRange) {
      const [minDepth, maxDepth] = filters.depthRange.split('-').map(Number);
      filtered = filtered.filter(location => {
        const locationMinDepth = location.depth?.min || 0;
        const locationMaxDepth = location.depth?.max || 100;
        return locationMinDepth >= minDepth && locationMaxDepth <= maxDepth;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'country':
          return a.country.localeCompare(b.country);
        case 'difficulty':
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'rating':
          return (b.rating?.average || 0) - (a.rating?.average || 0);
        case 'depth':
          return (a.depth?.max || 0) - (b.depth?.max || 0);
        default:
          return 0;
      }
    });

    setFilteredLocations(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'difficulty' || filterType === 'features' || filterType === 'countries') {
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else {
        newFilters[filterType] = value;
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      difficulty: [],
      features: [],
      countries: [],
      depthRange: '',
      sortBy: 'name'
    });
    setSearchTerm('');
  };

  // Use utility function for difficulty styling

  const handleFavoriteToggle = async (e, locationId) => {
    e.stopPropagation();
    try {
      if (isFavorite(locationId)) {
        await removeFromFavorites(locationId);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(locationId);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const hasActiveFilters = filters.difficulty.length > 0 || 
                          filters.features.length > 0 || 
                          filters.countries.length > 0 || 
                          filters.depthRange || 
                          searchTerm;

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading dive sites..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header with view toggle */}
        <div className="bg-gradient-to-r from-blue-500/80 to-cyan-600/80 backdrop-blur-sm rounded-xl p-6 mb-8 text-white shadow-xl border border-blue-400/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dive Sites Directory</h1>
              <p className="text-cyan-100">Explore {filteredLocations.length} of {locations.length} dive sites worldwide</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <FaMap className="mr-2" />
                Map View
              </button>
              <div className="flex items-center px-4 py-2 bg-white/30 rounded-lg">
                <FaList className="mr-2" />
                List View
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <GradientCard className="p-4 sticky top-4" padding="p-4">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-cyan-400" />
                  <h3 className="font-semibold text-white">Filters</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-1 transition-colors"
                  >
                    <FaTimes />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Sort */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Sort by</h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                >
                  <option value="name">Name</option>
                  <option value="country">Country</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="rating">Rating</option>
                  <option value="depth">Max Depth</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Difficulty</h4>
                <div className="space-y-2">
                  {['beginner', 'intermediate', 'advanced', 'expert'].map(difficulty => (
                    <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.difficulty.includes(difficulty)}
                        onChange={() => handleFilterChange('difficulty', difficulty)}
                        className="rounded text-cyan-400 bg-slate-700/50 border-slate-600/50 focus:ring-2 focus:ring-cyan-400"
                      />
                      <span className="text-sm capitalize text-white">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Features Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Features</h4>
                <div className="space-y-2">
                  {['reef', 'wreck', 'cave', 'wall', 'drift', 'sharks', 'rays', 'turtles'].map(feature => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature)}
                        onChange={() => handleFilterChange('features', feature)}
                        className="rounded text-cyan-400 bg-slate-700/50 border-slate-600/50 focus:ring-2 focus:ring-cyan-400"
                      />
                      <span className="text-sm capitalize text-white">{feature.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Countries Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Countries</h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {availableCountries.slice(0, 10).map(country => (
                    <label key={country} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.countries.includes(country)}
                        onChange={() => handleFilterChange('countries', country)}
                        className="rounded text-cyan-400 bg-slate-700/50 border-slate-600/50 focus:ring-2 focus:ring-cyan-400"
                      />
                      <span className="text-sm text-white">{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Depth Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Depth Range</h4>
                <select
                  value={filters.depthRange}
                  onChange={(e) => handleFilterChange('depthRange', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                >
                  <option value="">All depths</option>
                  <option value="0-18">0-18m (Open Water)</option>
                  <option value="18-30">18-30m (Advanced)</option>
                  <option value="30-40">30-40m (Deep)</option>
                  <option value="40-100">40m+ (Technical)</option>
                </select>
              </div>
            </GradientCard>
          </div>

          {/* Locations List */}
          <div className="lg:col-span-3">
            {filteredLocations.length === 0 ? (
              <EmptyState 
                icon={FaWater}
                title="No dive sites found"
                description="Try adjusting your filters or search terms"
              />
            ) : (
              <div className="space-y-4">
                {filteredLocations.map((location) => (
                  <GradientCard
                    key={location._id}
                    onClick={() => navigate(`/locations/${location._id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {/* Favorite Heart in front */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(e, location._id);
                            }}
                            className="p-1 hover:bg-slate-700/50 rounded-full transition-colors flex-shrink-0"
                            title={isFavorite(location._id) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {isFavorite(location._id) ? (
                              <FaHeart className="text-red-500 w-5 h-5" />
                            ) : (
                              <FaRegHeart className="text-gray-400 hover:text-red-400 w-5 h-5" />
                            )}
                          </button>
                          <h3 className="text-xl font-bold text-white">{location.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyBadgeClasses(location.difficulty)}`}>
                            {location.difficulty}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-300 mb-3 space-x-4">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-cyan-400 mr-1" />
                            <span>{location.country}, {location.region}</span>
                          </div>
                          <div className="flex items-center">
                            <FaWater className="text-blue-400 mr-1" />
                            <span>{location.depth?.min}-{location.depth?.max}m</span>
                          </div>
                          <div className="flex items-center">
                            <FaEye className="text-green-400 mr-1" />
                            <span className="capitalize">{location.visibility}</span>
                          </div>
                          <div className="flex items-center">
                            <FaThermometerHalf className="text-red-400 mr-1" />
                            <span>{location.waterTemperature?.summer?.min}-{location.waterTemperature?.summer?.max}°C</span>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{location.description}</p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {location.features?.slice(0, 4).map((feature, index) => (
                            <span key={index} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs border border-cyan-500/30">
                              {feature.replace('_', ' ')}
                            </span>
                          ))}
                          {location.features?.length > 4 && (
                            <span className="text-cyan-400 text-xs">+{location.features.length - 4} more</span>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="text-right">
                        <div className="flex items-center justify-end mb-1">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="text-white font-semibold">
                            {location.rating?.average?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs">
                          {location.rating?.count || 0} reviews
                        </p>
                      </div>
                    </div>
                  </GradientCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiveSitesListPage;