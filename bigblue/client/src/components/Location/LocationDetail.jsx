import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Thermometer, Eye, Waves, Fish, Calendar, Users, Star, ArrowLeft, Camera, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import { locationAPI, buddyRequestAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [buddyRequests, setBuddyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchLocationDetail();
      fetchBuddyRequests();
    }
  }, [id]);

  const fetchLocationDetail = async () => {
    try {
      const response = await locationAPI.getById(id);
      setLocation(response.data.data);
    } catch (error) {
      console.error('Error fetching location:', error);
      toast.error('Failed to load location details');
      navigate('/');
    }
  };

  const fetchBuddyRequests = async () => {
    try {
      const response = await buddyRequestAPI.getByLocation(id);
      setBuddyRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching buddy requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBuddyRequest = () => {
    navigate('/buddy-board', { state: { selectedLocationId: id } });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const TabButton = ({ tabKey, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`flex items-center px-4 py-2 rounded-lg transition-all ${
        activeTab === tabKey
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
          : 'text-gray-400 hover:text-white hover:bg-slate-600/30'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  if (loading || !location) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-300">Loading location details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{location.name}</h1>
                <div className="flex items-center text-gray-300 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{location.region}, {location.country}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getDifficultyColor(location.difficulty)}`}>
                    {location.difficulty}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400 border border-blue-400/30">
                    {location.depth.min}m - {location.depth.max}m
                  </span>
                  {location.features && location.features.map((feature, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-400 border border-purple-400/30">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="flex items-center mb-4">
                  {location.averageRating && (
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="text-white font-semibold">{location.averageRating.toFixed(1)}</span>
                      <span className="text-gray-400 ml-1">({location.reviewCount || 0})</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCreateBuddyRequest}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 flex items-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Find Dive Buddy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton tabKey="overview" label="Overview" icon={BookOpen} />
          <TabButton tabKey="conditions" label="Conditions" icon={Waves} />
          <TabButton tabKey="marine-life" label="Marine Life" icon={Fish} />
          <TabButton tabKey="buddies" label="Buddy Requests" icon={Users} />
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {location.description || 'No description available for this dive site.'}
                  </p>
                </div>

                {/* Key Stats */}
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-4">Dive Statistics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{location.depth.min}m</div>
                      <div className="text-sm text-gray-400">Min Depth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{location.depth.max}m</div>
                      <div className="text-sm text-gray-400">Max Depth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{location.averageTemp || 'N/A'}</div>
                      <div className="text-sm text-gray-400">Avg Temp (°C)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{location.averageVisibility || 'N/A'}</div>
                      <div className="text-sm text-gray-400">Visibility (m)</div>
                    </div>
                  </div>
                </div>

                {/* Best Months to Visit */}
                {location.bestMonths && location.bestMonths.length > 0 && (
                  <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Best Months to Visit</h2>
                    <div className="flex flex-wrap gap-2">
                      {location.bestMonths.map((month, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-400/30">
                          <Calendar className="w-3 h-3 mr-1" />
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'conditions' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-6">Diving Conditions</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-300 mb-3 flex items-center">
                        <Thermometer className="w-4 h-4 mr-2" />
                        Water Temperature
                      </h3>
                      <p className="text-gray-400">
                        {location.waterTemperature || 'Temperature data varies by season. Check recent dive logs for current conditions.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-300 mb-3 flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Visibility
                      </h3>
                      <p className="text-gray-400">
                        {location.visibility || 'Visibility conditions vary. Typically ranges from 10-30m depending on weather and season.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-300 mb-3 flex items-center">
                        <Waves className="w-4 h-4 mr-2" />
                        Currents
                      </h3>
                      <p className="text-gray-400">
                        {location.currents || 'Current strength varies by location and tides. Check local conditions before diving.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-300 mb-3">
                        Entry Type
                      </h3>
                      <p className="text-gray-400">
                        {location.entryType || 'Entry method varies by specific dive site. Shore entry and boat access available.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'marine-life' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-6">Marine Life</h2>
                  
                  {location.marineLife && location.marineLife.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {location.marineLife.map((species, index) => (
                        <div key={index} className="flex items-center p-3 bg-slate-600/30 rounded-lg border border-slate-500/30">
                          <Fish className="w-5 h-5 text-cyan-400 mr-3" />
                          <span className="text-white">{species}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Fish className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No marine life data available for this location.</p>
                      <p className="text-gray-500 text-sm mt-2">Help us by logging your dives and the species you encounter!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'buddies' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Active Buddy Requests</h2>
                    <span className="text-sm text-gray-400">
                      {buddyRequests.length} active request{buddyRequests.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {buddyRequests.length > 0 ? (
                    <div className="space-y-4">
                      {buddyRequests.map((request, index) => (
                        <div key={index} className="p-4 bg-slate-600/30 rounded-lg border border-slate-500/30">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-white">{request.requester?.name || 'Anonymous Diver'}</h3>
                              <p className="text-sm text-gray-400">
                                {request.requester?.certificationLevel || 'Certified'} • {request.requester?.numberOfDives || 0} dives
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-cyan-400">{new Date(request.diveDate).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-400">{request.diveTime}</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">{request.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-400/30">
                                {request.experienceRequired}
                              </span>
                              <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-400/30">
                                {request.acceptedBuddies?.length || 0}/{request.maxBuddies || 1} spots
                              </span>
                            </div>
                            <button
                              onClick={() => navigate('/buddy-board')}
                              className="text-sm text-cyan-400 hover:text-cyan-300"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No active buddy requests for this location</p>
                      <button
                        onClick={handleCreateBuddyRequest}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all"
                      >
                        Create First Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(location.difficulty)}`}>
                    {location.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Depth Range:</span>
                  <span className="text-white">{location.depth.min}m - {location.depth.max}m</span>
                </div>
                {location.coordinates && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coordinates:</span>
                    <span className="text-white text-sm">
                      {location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}
                    </span>
                  </div>
                )}
                {location.timeZone && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Zone:</span>
                    <span className="text-white">{location.timeZone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-400">Last logged dive:</span>
                  <span className="text-white ml-1">2 days ago</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Active buddies:</span>
                  <span className="text-white ml-1">{buddyRequests.length}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">This month:</span>
                  <span className="text-white ml-1">12 dives logged</span>
                </div>
              </div>
            </div>

            {/* Weather Widget Placeholder */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Current Weather</h3>
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🌤️</div>
                <p className="text-gray-400 text-sm">Weather data coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;