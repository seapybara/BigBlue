import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Thermometer, Eye, Edit, Trash2, Plus, Filter, Search, BarChart, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { diveAPI } from '../../services/api';
import DiveLogForm from './DiveLogForm';

const DiveLogList = () => {
  const [dives, setDives] = useState([]);
  const [filteredDives, setFilteredDives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDive, setEditingDive] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDive, setSelectedDive] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    minDepth: '',
    maxDepth: '',
    rating: ''
  });

  const [stats, setStats] = useState({
    totalDives: 0,
    totalBottomTime: 0,
    maxDepth: 0,
    avgDepth: 0,
    favoriteSite: ''
  });

  useEffect(() => {
    fetchDives();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [filters, dives]);

  const fetchDives = async () => {
    try {
      setLoading(true);
      const response = await diveAPI.getAll();
      const diveData = response.data.data || [];
      setDives(diveData);
      setFilteredDives(diveData);
    } catch (error) {
      console.error('Error fetching dives:', error);
      toast.error('Failed to load dive logs');
      setDives([]);
      setFilteredDives([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...dives];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(dive => 
        dive.location?.name?.toLowerCase().includes(searchLower) ||
        dive.customLocation?.toLowerCase().includes(searchLower) ||
        dive.notes?.toLowerCase().includes(searchLower) ||
        dive.marineLifeSeen?.some(species => species.toLowerCase().includes(searchLower))
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(dive => 
        new Date(dive.diveDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(dive => 
        new Date(dive.diveDate) <= new Date(filters.dateTo)
      );
    }

    if (filters.minDepth) {
      filtered = filtered.filter(dive => 
        dive.maxDepth >= parseFloat(filters.minDepth)
      );
    }

    if (filters.maxDepth) {
      filtered = filtered.filter(dive => 
        dive.maxDepth <= parseFloat(filters.maxDepth)
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(dive => 
        dive.rating >= parseInt(filters.rating)
      );
    }

    setFilteredDives(filtered);
  };

  const calculateStats = () => {
    if (dives.length === 0) {
      setStats({
        totalDives: 0,
        totalBottomTime: 0,
        maxDepth: 0,
        avgDepth: 0,
        favoriteSite: ''
      });
      return;
    }

    const totalBottomTime = dives.reduce((sum, dive) => sum + (dive.duration || 0), 0);
    const maxDepth = Math.max(...dives.map(dive => dive.maxDepth || 0));
    const avgDepth = dives.reduce((sum, dive) => sum + (dive.maxDepth || 0), 0) / dives.length;
    
    // Find most visited site
    const siteCount = {};
    dives.forEach(dive => {
      const site = dive.location?.name || dive.customLocation || 'Unknown';
      siteCount[site] = (siteCount[site] || 0) + 1;
    });
    
    const favoriteSite = Object.keys(siteCount).reduce((a, b) => 
      siteCount[a] > siteCount[b] ? a : b, 'None'
    );

    setStats({
      totalDives: dives.length,
      totalBottomTime,
      maxDepth,
      avgDepth: Math.round(avgDepth * 10) / 10,
      favoriteSite
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      minDepth: '',
      maxDepth: '',
      rating: ''
    });
  };

  const handleEdit = (dive) => {
    setEditingDive(dive);
    setShowForm(true);
  };

  const handleDelete = async (diveId) => {
    if (!window.confirm('Are you sure you want to delete this dive log?')) {
      return;
    }

    try {
      await diveAPI.delete(diveId);
      toast.success('Dive log deleted successfully');
      fetchDives();
    } catch (error) {
      console.error('Error deleting dive:', error);
      toast.error('Failed to delete dive log');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDive(null);
  };

  const handleFormSave = () => {
    fetchDives();
  };

  const DiveCard = ({ dive }) => (
    <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all p-6 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {dive.location?.name || dive.customLocation || 'Custom Location'}
          </h3>
          <p className="text-sm text-gray-300">
            {dive.location?.country && `${dive.location.country} • `}
            {new Date(dive.diveDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${
                  star <= dive.rating ? 'text-yellow-400' : 'text-gray-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-cyan-400">{dive.maxDepth}m</div>
          <div className="text-xs text-gray-400">Max Depth</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{dive.duration}min</div>
          <div className="text-xs text-gray-400">Duration</div>
        </div>
        {dive.waterTemperature && (
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{dive.waterTemperature}°C</div>
            <div className="text-xs text-gray-400">Water Temp</div>
          </div>
        )}
        {dive.visibility && (
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{dive.visibility}m</div>
            <div className="text-xs text-gray-400">Visibility</div>
          </div>
        )}
      </div>

      {/* Marine Life */}
      {dive.marineLifeSeen && dive.marineLifeSeen.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Marine Life Seen:</div>
          <div className="flex flex-wrap gap-1">
            {dive.marineLifeSeen.slice(0, 3).map((species, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-400/30"
              >
                {species}
              </span>
            ))}
            {dive.marineLifeSeen.length > 3 && (
              <span className="inline-block px-2 py-1 rounded-md bg-slate-600/60 text-gray-300 text-xs border border-slate-400/30">
                +{dive.marineLifeSeen.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {dive.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-300 line-clamp-2">{dive.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setSelectedDive(dive)}
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          View Details
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(dive)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-600/50 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(dive._id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dive Logs</h1>
            <p className="text-gray-300 mt-2">Track and analyze your diving adventures</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Log New Dive
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-4 shadow-md">
            <div className="text-2xl font-bold text-cyan-400">{stats.totalDives}</div>
            <div className="text-sm text-gray-400">Total Dives</div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-4 shadow-md">
            <div className="text-2xl font-bold text-blue-400">{Math.round(stats.totalBottomTime / 60)}h</div>
            <div className="text-sm text-gray-400">Bottom Time</div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-4 shadow-md">
            <div className="text-2xl font-bold text-green-400">{stats.maxDepth}m</div>
            <div className="text-sm text-gray-400">Max Depth</div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-4 shadow-md">
            <div className="text-2xl font-bold text-purple-400">{stats.avgDepth}m</div>
            <div className="text-sm text-gray-400">Avg Depth</div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-4 shadow-md">
            <div className="text-sm font-bold text-yellow-400 truncate">{stats.favoriteSite}</div>
            <div className="text-sm text-gray-400">Favorite Site</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2 text-gray-300" />
              <span className="font-medium text-white">Filters</span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location, notes..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Min Depth</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minDepth}
                  onChange={(e) => handleFilterChange('minDepth', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Max Depth</label>
                <input
                  type="number"
                  placeholder="100"
                  value={filters.maxDepth}
                  onChange={(e) => handleFilterChange('maxDepth', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
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

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-300">
            Showing <span className="font-medium">{filteredDives.length}</span> of <span className="font-medium">{dives.length}</span> dive logs
          </p>
        </div>

        {/* Dive Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-300">Loading dive logs...</p>
          </div>
        ) : filteredDives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDives.map(dive => (
              <DiveCard key={dive._id} dive={dive} />
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg shadow-lg p-12 text-center">
            <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No dive logs found</h3>
            <p className="text-gray-300 mb-4">
              {dives.length === 0 ? 'Start logging your dives to track your underwater adventures!' : 'Try adjusting your filters to see more results.'}
            </p>
            {dives.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all"
              >
                Log Your First Dive
              </button>
            )}
          </div>
        )}

        {/* Forms */}
        {showForm && (
          <DiveLogForm
            editDive={editingDive}
            onClose={handleFormClose}
            onSave={handleFormSave}
          />
        )}

        {/* Dive Detail Modal */}
        {selectedDive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedDive.location?.name || selectedDive.customLocation || 'Custom Location'}
                    </h2>
                    <p className="text-gray-300">
                      {selectedDive.location?.country && `${selectedDive.location.country} • `}
                      {new Date(selectedDive.diveDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDive(null)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Dive Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-lg font-bold text-cyan-400">{selectedDive.maxDepth}m</div>
                      <div className="text-sm text-gray-400">Max Depth</div>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-lg font-bold text-blue-400">{selectedDive.duration}min</div>
                      <div className="text-sm text-gray-400">Duration</div>
                    </div>
                    {selectedDive.waterTemperature && (
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-400">{selectedDive.waterTemperature}°C</div>
                        <div className="text-sm text-gray-400">Water Temp</div>
                      </div>
                    )}
                    {selectedDive.visibility && (
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="text-lg font-bold text-purple-400">{selectedDive.visibility}m</div>
                        <div className="text-sm text-gray-400">Visibility</div>
                      </div>
                    )}
                  </div>

                  {/* Marine Life */}
                  {selectedDive.marineLifeSeen && selectedDive.marineLifeSeen.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-white mb-3">Marine Life Observed</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDive.marineLifeSeen.map((species, index) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-400/30"
                          >
                            {species}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conditions */}
                  {(selectedDive.conditions?.weather || selectedDive.conditions?.current || selectedDive.conditions?.waves) && (
                    <div>
                      <h3 className="font-semibold text-white mb-3">Conditions</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {selectedDive.conditions.weather && (
                          <div>
                            <span className="text-gray-400">Weather:</span>
                            <span className="text-white ml-1 capitalize">{selectedDive.conditions.weather}</span>
                          </div>
                        )}
                        {selectedDive.conditions.current && (
                          <div>
                            <span className="text-gray-400">Current:</span>
                            <span className="text-white ml-1 capitalize">{selectedDive.conditions.current}</span>
                          </div>
                        )}
                        {selectedDive.conditions.waves && (
                          <div>
                            <span className="text-gray-400">Waves:</span>
                            <span className="text-white ml-1 capitalize">{selectedDive.conditions.waves}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedDive.notes && (
                    <div>
                      <h3 className="font-semibold text-white mb-3">Notes</h3>
                      <p className="text-gray-300">{selectedDive.notes}</p>
                    </div>
                  )}

                  {/* Rating */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Rating</h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${
                            star <= selectedDive.rating ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiveLogList;