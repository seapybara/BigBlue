import React from 'react';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

const MapFilters = ({ filters = {}, onFilterChange, onClearFilters, locationCount = 0 }) => {
  // Ensure filters have default values
  const safeFilters = {
    difficulty: filters?.difficulty || [],
    features: filters?.features || [],
    depthRange: filters?.depthRange || '',
    search: filters?.search || ''
  };

  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  const features = ['reef', 'wreck', 'cave', 'wall', 'sharks', 'turtles', 'night_diving'];
  const depths = [
    { label: '0-18m (Open Water)', value: '0-18' },
    { label: '18-30m (Advanced)', value: '18-30' },
    { label: '30-40m (Deep)', value: '30-40' },
    { label: '40m+ (Technical)', value: '40-100' }
  ];

  const handleDifficultyChange = (difficulty) => {
    if (!onFilterChange) return;
    const newDifficulties = safeFilters.difficulty.includes(difficulty)
      ? safeFilters.difficulty.filter(d => d !== difficulty)
      : [...safeFilters.difficulty, difficulty];
    onFilterChange({ ...safeFilters, difficulty: newDifficulties });
  };

  const handleFeatureChange = (feature) => {
    if (!onFilterChange) return;
    const newFeatures = safeFilters.features.includes(feature)
      ? safeFilters.features.filter(f => f !== feature)
      : [...safeFilters.features, feature];
    onFilterChange({ ...safeFilters, features: newFeatures });
  };

  const handleDepthChange = (depthRange) => {
    if (!onFilterChange) return;
    onFilterChange({ ...safeFilters, depthRange });
  };

  const handleSearchChange = (e) => {
    if (!onFilterChange) return;
    onFilterChange({ ...safeFilters, search: e.target.value });
  };

  const hasActiveFilters = safeFilters.difficulty.length > 0 || 
                          safeFilters.features.length > 0 || 
                          safeFilters.depthRange || 
                          safeFilters.search;

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-blue-500/20 rounded-lg shadow-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaFilter className="text-cyan-400" />
          <h3 className="font-semibold text-white">Filters</h3>
        </div>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-1 transition-colors"
          >
            <FaTimes />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search locations..."
          value={safeFilters.search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-300">
        Showing <span className="font-semibold text-cyan-400">{locationCount}</span> dive sites
      </div>

      {/* Difficulty Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Difficulty Level</h4>
        <div className="grid grid-cols-2 gap-2">
          {difficulties.map(difficulty => (
            <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={safeFilters.difficulty.includes(difficulty)}
                onChange={() => handleDifficultyChange(difficulty)}
                className="rounded text-cyan-400 bg-slate-700/50 border-slate-600/50 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
              />
              <span className="text-sm capitalize text-white">{difficulty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Depth Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Depth Range</h4>
        <select
          value={safeFilters.depthRange}
          onChange={(e) => handleDepthChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
        >
          <option value="">All depths</option>
          {depths.map(depth => (
            <option key={depth.value} value={depth.value}>
              {depth.label}
            </option>
          ))}
        </select>
      </div>

      {/* Features Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Features</h4>
        <div className="space-y-2">
          {features.map(feature => (
            <label key={feature} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={safeFilters.features.includes(feature)}
                onChange={() => handleFeatureChange(feature)}
                className="rounded text-cyan-400 bg-slate-700/50 border-slate-600/50 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
              />
              <span className="text-sm capitalize text-white">{feature.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="pt-4 border-t border-slate-600/50">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Quick Stats</h4>
        <div className="space-y-1 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Total Sites:</span>
            <span className="font-semibold text-cyan-400">{locationCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Countries:</span>
            <span className="font-semibold text-cyan-400">60</span>
          </div>
          <div className="flex justify-between">
            <span>Active Buddies:</span>
            <span className="font-semibold text-blue-400">147</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;