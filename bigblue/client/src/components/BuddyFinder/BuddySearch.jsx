import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, Users, Calendar, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import { userAPI, locationAPI } from '../../services/api';

const BuddySearch = ({ onBuddySelect }) => {
  const [buddies, setBuddies] = useState([]);
  const [filteredBuddies, setFilteredBuddies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    certificationLevel: '',
    experienceLevel: '',
    maxDistance: '',
    availableFrom: '',
    availableTo: ''
  });

  useEffect(() => {
    fetchBuddies();
    fetchLocations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, buddies]);

  const fetchBuddies = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      const buddyData = response.data.data || [];
      // Filter out current user
      const availableBuddies = buddyData.filter(buddy => buddy.isLookingForBuddy !== false);
      setBuddies(availableBuddies);
      setFilteredBuddies(availableBuddies);
    } catch (error) {
      console.error('Error fetching buddies:', error);
      toast.error('Failed to load available dive buddies');
      setBuddies([]);
      setFilteredBuddies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await locationAPI.getAll();
      setLocations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...buddies];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(buddy => 
        buddy.name.toLowerCase().includes(searchLower) ||
        buddy.bio?.toLowerCase().includes(searchLower) ||
        buddy.location?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(buddy => 
        buddy.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        buddy.preferredDiveLocations?.some(loc => 
          loc.toLowerCase().includes(filters.location.toLowerCase())
        )
      );
    }

    if (filters.certificationLevel) {
      filtered = filtered.filter(buddy => 
        buddy.certificationLevel === filters.certificationLevel
      );
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(buddy => 
        buddy.experienceLevel === filters.experienceLevel
      );
    }

    setFilteredBuddies(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      certificationLevel: '',
      experienceLevel: '',
      maxDistance: '',
      availableFrom: '',
      availableTo: ''
    });
  };

  const getExperienceColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-orange-400';
      case 'expert':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const BuddyCard = ({ buddy }) => (
    <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
            {buddy.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{buddy.name}</h3>
            <div className="flex items-center text-sm text-gray-300">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{buddy.location || 'Location not specified'}</span>
            </div>
          </div>
        </div>
        {buddy.rating && (
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-white font-semibold">{buddy.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-cyan-400">{buddy.numberOfDives || 0}</div>
          <div className="text-xs text-gray-400">Total Dives</div>
        </div>
        <div className="text-center">
          <div className={`text-sm font-semibold ${getExperienceColor(buddy.experienceLevel)}`}>
            {buddy.experienceLevel || 'Beginner'}
          </div>
          <div className="text-xs text-gray-400">Experience</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-white">{buddy.certificationLevel || 'Open Water'}</div>
          <div className="text-xs text-gray-400">Certification</div>
        </div>
      </div>

      {/* Bio */}
      {buddy.bio && (
        <div className="mb-4">
          <p className="text-sm text-gray-300 line-clamp-2">{buddy.bio}</p>
        </div>
      )}

      {/* Equipment */}
      {buddy.equipment && buddy.equipment.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">Equipment Available:</div>
          <div className="flex flex-wrap gap-1">
            {buddy.equipment.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs border border-blue-400/30"
              >
                {item}
              </span>
            ))}
            {buddy.equipment.length > 3 && (
              <span className="inline-block px-2 py-1 rounded-md bg-slate-600/60 text-gray-300 text-xs border border-slate-400/30">
                +{buddy.equipment.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Preferred Locations */}
      {buddy.preferredDiveLocations && buddy.preferredDiveLocations.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">Prefers diving at:</div>
          <div className="flex flex-wrap gap-1">
            {buddy.preferredDiveLocations.slice(0, 2).map((location, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs border border-purple-400/30"
              >
                {location}
              </span>
            ))}
            {buddy.preferredDiveLocations.length > 2 && (
              <span className="inline-block px-2 py-1 rounded-md bg-slate-600/60 text-gray-300 text-xs border border-slate-400/30">
                +{buddy.preferredDiveLocations.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Availability */}
      {buddy.availability && (
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Availability:
          </div>
          <div className="text-sm text-green-400">{buddy.availability}</div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-slate-600/50">
        <button
          onClick={() => onBuddySelect && onBuddySelect(buddy)}
          className="flex-1 px-4 py-2 border border-slate-500/50 rounded-md text-gray-300 hover:bg-slate-600/30 transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={() => {/* TODO: Implement message functionality */}}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all"
        >
          Send Message
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Find Dive Buddies</h2>
            <p className="text-gray-300">Connect with certified divers near you</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, location, or interests..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <span className="text-sm text-gray-400">
            {filteredBuddies.length} of {buddies.length} buddies
          </span>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-600/50">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
              <input
                type="text"
                placeholder="City, country..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Certification</label>
              <select
                value={filters.certificationLevel}
                onChange={(e) => handleFilterChange('certificationLevel', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <option value="">All Certifications</option>
                <option value="Open Water">Open Water</option>
                <option value="Advanced Open Water">Advanced Open Water</option>
                <option value="Rescue Diver">Rescue Diver</option>
                <option value="Divemaster">Divemaster</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Experience</label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-sm text-gray-300 hover:text-white border border-slate-500/50 rounded-md hover:bg-slate-600/30 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-300">Loading dive buddies...</p>
        </div>
      ) : filteredBuddies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuddies.map(buddy => (
            <BuddyCard key={buddy._id} buddy={buddy} />
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg shadow-lg p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No dive buddies found</h3>
          <p className="text-gray-300 mb-4">
            {buddies.length === 0 
              ? 'No divers are currently looking for buddies.'
              : 'Try adjusting your search filters to find more buddies.'
            }
          </p>
          {filters.search || filters.location || filters.certificationLevel || filters.experienceLevel ? (
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BuddySearch;