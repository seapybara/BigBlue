import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Award, Clock, Filter, Plus, Search, ChevronDown, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { buddyAPI, locationAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BuddyBoardPage = () => {
  const { user } = useAuth();
  const [buddyRequests, setBuddyRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    location: '',
    dateFrom: '',
    dateTo: '',
    experienceLevel: '',
    certificationLevel: ''
  });

  const [newRequest, setNewRequest] = useState({
    locationId: '',
    diveDate: '',
    diveTime: '',
    experienceRequired: 'Beginner',
    certificationRequired: 'Open Water',
    maxBuddies: 1,
    description: '',
    equipment: ''
  });

  useEffect(() => {
    fetchBuddyRequests();
    fetchLocations();
  }, []);

  const fetchBuddyRequests = async () => {
    try {
      setLoading(true);
      const response = await buddyAPI.getAll();
      const requests = response.data.data || [];
      setBuddyRequests(requests);
      setFilteredRequests(requests);
    } catch (error) {
      console.error('Error fetching buddy requests:', error);
      toast.error('Failed to load buddy requests');
      setBuddyRequests([]);
      setFilteredRequests([]);
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
      setLocations([]);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...buddyRequests];
    
    if (filters.location) {
      filtered = filtered.filter(req => 
        req.location.name.toLowerCase().includes(filters.location.toLowerCase()) ||
        req.location.country.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(req => new Date(req.diveDate) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(req => new Date(req.diveDate) <= new Date(filters.dateTo));
    }
    
    if (filters.experienceLevel) {
      filtered = filtered.filter(req => req.experienceRequired === filters.experienceLevel);
    }
    
    if (filters.certificationLevel) {
      filtered = filtered.filter(req => req.certificationRequired === filters.certificationLevel);
    }
    
    setFilteredRequests(filtered);
  }, [filters, buddyRequests]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      dateFrom: '',
      dateTo: '',
      experienceLevel: '',
      certificationLevel: ''
    });
  };

  const handleCreateRequest = async () => {
    try {
      const requestData = {
        ...newRequest,
        maxBuddies: parseInt(newRequest.maxBuddies) || 1
      };
      
      await buddyAPI.create(requestData);
      toast.success('Buddy request created successfully!');
      setShowCreateModal(false);
      
      // Reset form
      setNewRequest({
        locationId: '',
        diveDate: '',
        diveTime: '',
        experienceRequired: 'Beginner',
        certificationRequired: 'Open Water',
        maxBuddies: 1,
        description: '',
        equipment: ''
      });
      
      // Refresh requests
      fetchBuddyRequests();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.message || 'Failed to create buddy request');
    }
  };

  const handleJoinRequest = async (requestId) => {
    try {
      await buddyAPI.join(requestId);
      toast.success('Successfully joined the dive request!');
      fetchBuddyRequests(); // Refresh to show updated status
    } catch (error) {
      console.error('Error joining request:', error);
      toast.error(error.response?.data?.message || 'Failed to join buddy request');
    }
  };

  const RequestCard = ({ request }) => (
    <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all p-6 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{request.location.name}</h3>
          <p className="text-sm text-gray-300">{request.location.country}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          request.location.difficulty === 'Advanced' ? 'bg-red-100 text-red-800' :
          request.location.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {request.location.difficulty}
        </span>
      </div>

      {/* Date and Time */}
      <div className="flex items-center text-sm text-gray-300 mb-3">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{new Date(request.diveDate).toLocaleDateString()}</span>
        <Clock className="w-4 h-4 ml-4 mr-2" />
        <span>{request.diveTime}</span>
      </div>

      {/* Requester Info */}
<div className="bg-slate-600/60 rounded-lg p-3 mb-3 border border-slate-400/50 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-white">{request.requester.name}</p>
            <p className="text-xs text-cyan-400">
              {request.requester.certificationLevel} • {request.requester.numberOfDives} dives
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-cyan-300 capitalize">{request.requester.experienceLevel}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{request.description}</p>

      {/* Requirements */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/20 text-xs text-blue-300 border border-blue-400/30">
          <Award className="w-3 h-3 mr-1" />
          {request.certificationRequired}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-500/20 text-xs text-purple-300 border border-purple-400/30">
          {request.experienceRequired} Level
        </span>
      </div>

      {/* Buddies Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-300">
          <Users className="w-4 h-4 mr-1" />
          <span>{request.acceptedBuddies.length} / {request.maxBuddies} buddies</span>
        </div>
        {request.acceptedBuddies.length < request.maxBuddies && (
          <span className="text-xs text-green-400 font-medium">Spots available</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={() => setSelectedRequest(request)}
          className="flex-1 px-4 py-2 border border-slate-500/50 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-600/30 transition-colors"
        >
          View Details
        </button>
        <button 
          onClick={() => handleJoinRequest(request.id)}
          disabled={request.acceptedBuddies.length >= request.maxBuddies}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            request.acceptedBuddies.length >= request.maxBuddies
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'
          }`}
        >
          {request.acceptedBuddies.length >= request.maxBuddies ? 'Full' : 'Request to Join'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Buddy Board</h1>
            <p className="text-gray-300 mt-2">Find dive buddies for your next adventure</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Request
          </button>
        </div>

        {/* Filters Bar */}
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
              <ChevronDown className={`inline w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Search location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Experience</label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
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
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-300">
            Found <span className="font-medium">{filteredRequests.length}</span> buddy requests
          </p>
        </div>

        {/* Request Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-300">Loading buddy requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg shadow-lg p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No buddy requests found</h3>
            <p className="text-gray-300">Try adjusting your filters or create a new request</p>
          </div>
        )}

        {/* Create Request Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Create Buddy Request</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Dive Location</label>
                    <select
                      value={newRequest.locationId}
                      onChange={(e) => setNewRequest({...newRequest, locationId: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    >
                      <option value="">Select a location</option>
                      {locations.map(location => (
                        <option key={location._id} value={location._id}>
                          {location.name}, {location.country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Dive Date</label>
                      <input
                        type="date"
                        value={newRequest.diveDate}
                        onChange={(e) => setNewRequest({...newRequest, diveDate: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Dive Time</label>
                      <input
                        type="time"
                        value={newRequest.diveTime}
                        onChange={(e) => setNewRequest({...newRequest, diveTime: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Experience Required</label>
                      <select
                        value={newRequest.experienceRequired}
                        onChange={(e) => setNewRequest({...newRequest, experienceRequired: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Certification Required</label>
                      <select
                        value={newRequest.certificationRequired}
                        onChange={(e) => setNewRequest({...newRequest, certificationRequired: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                      >
                        <option value="Open Water">Open Water</option>
                        <option value="Advanced Open Water">Advanced Open Water</option>
                        <option value="Rescue Diver">Rescue Diver</option>
                        <option value="Divemaster">Divemaster</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Number of Buddies Needed</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={newRequest.maxBuddies}
                      onChange={(e) => setNewRequest({...newRequest, maxBuddies: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                      rows="4"
                      placeholder="Describe your dive plan, what you're looking to see, experience level expectations..."
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Equipment Notes (Optional)</label>
                    <input
                      type="text"
                      value={newRequest.equipment}
                      onChange={(e) => setNewRequest({...newRequest, equipment: e.target.value})}
                      placeholder="e.g., BCD and regulator available for rent"
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-slate-500/50 rounded-md text-gray-300 hover:bg-slate-600/30 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateRequest}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all"
                    >
                      Create Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedRequest.location.name}</h2>
                    <p className="text-gray-300">{selectedRequest.location.country}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Dive Details */}
                  <div className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/30">
                    <h3 className="font-semibold text-white mb-3">Dive Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-300">Date</p>
                        <p className="font-medium text-white">{new Date(selectedRequest.diveDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Time</p>
                        <p className="font-medium text-white">{selectedRequest.diveTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Difficulty</p>
                        <p className="font-medium text-white">{selectedRequest.location.difficulty}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Spots Available</p>
                        <p className="font-medium text-white">
                          {selectedRequest.maxBuddies - selectedRequest.acceptedBuddies.length} of {selectedRequest.maxBuddies}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Organizer Info */}
                  <div className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/30">
                    <h3 className="font-semibold text-white mb-3">Dive Organizer</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{selectedRequest.requester.name}</p>
                        <p className="text-sm text-gray-300">
                          {selectedRequest.requester.certificationLevel} • {selectedRequest.requester.experienceLevel}
                        </p>
                        <p className="text-sm text-gray-300">{selectedRequest.requester.numberOfDives} total dives</p>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-500/20 text-sm text-blue-300 border border-blue-400/30">
                        <Award className="w-4 h-4 mr-1" />
                        {selectedRequest.certificationRequired} Required
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-purple-500/20 text-sm text-purple-300 border border-purple-400/30">
                        {selectedRequest.experienceRequired} Experience Level
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Description</h3>
                    <p className="text-gray-300">{selectedRequest.description}</p>
                  </div>

                  {/* Accepted Buddies */}
                  {selectedRequest.acceptedBuddies.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-white mb-3">Confirmed Buddies</h3>
                      <div className="space-y-2">
                        {selectedRequest.acceptedBuddies.map((buddy, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <Users className="w-4 h-4 mr-2" />
                            {buddy.user.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="flex-1 px-4 py-2 border border-slate-500/50 rounded-md text-gray-300 hover:bg-slate-600/30 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        handleJoinRequest(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      disabled={selectedRequest.acceptedBuddies.length >= selectedRequest.maxBuddies}
                      className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                        selectedRequest.acceptedBuddies.length >= selectedRequest.maxBuddies
                          ? 'bg-slate-500/50 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'
                      }`}
                    >
                      {selectedRequest.acceptedBuddies.length >= selectedRequest.maxBuddies 
                        ? 'No Spots Available' 
                        : 'Request to Join'}
                    </button>
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

export default BuddyBoardPage;