import React, { useState, useEffect } from 'react';
import { X, MapPin, Star, Calendar, Award, MessageCircle, UserPlus, Camera, Fish, Thermometer, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { userAPI, diveAPI, buddyAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const BuddyProfile = ({ buddy, onClose, onSendMessage }) => {
  const { user } = useAuth();
  const [recentDives, setRecentDives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (buddy) {
      fetchRecentDives();
    }
  }, [buddy]);

  const fetchRecentDives = async () => {
    try {
      const response = await diveAPI.getByUser(buddy._id);
      setRecentDives(response.data.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching recent dives:', error);
      setRecentDives([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBuddyRequest = async () => {
    try {
      // This would create a buddy request or start a conversation
      await buddyAPI.sendRequest({
        receiverId: buddy._id,
        message: `Hi ${buddy.name}, I'd like to dive with you!`
      });
      toast.success('Buddy request sent successfully!');
    } catch (error) {
      console.error('Error sending buddy request:', error);
      toast.error('Failed to send buddy request');
    }
  };

  const getExperienceColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'advanced':
        return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
      case 'expert':
        return 'text-red-400 bg-red-500/20 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
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

  if (!buddy) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                {buddy.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{buddy.name}</h2>
                <div className="flex items-center text-gray-300 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{buddy.location || 'Location not specified'}</span>
                </div>
                {buddy.rating && (
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-white font-semibold">{buddy.rating.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1">({buddy.reviewCount || 0} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/30">
              <div className="text-2xl font-bold text-cyan-400">{buddy.numberOfDives || 0}</div>
              <div className="text-sm text-gray-400">Total Dives</div>
            </div>
            <div className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/30">
              <div className={`text-lg font-semibold ${getExperienceColor(buddy.experienceLevel).split(' ')[0]}`}>
                {buddy.experienceLevel || 'Beginner'}
              </div>
              <div className="text-sm text-gray-400">Experience Level</div>
            </div>
            <div className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/30">
              <div className="text-sm font-semibold text-white">{buddy.certificationLevel || 'Open Water'}</div>
              <div className="text-sm text-gray-400">Certification</div>
            </div>
            <div className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/30">
              <div className="text-2xl font-bold text-purple-400">{buddy.yearsExperience || 0}</div>
              <div className="text-sm text-gray-400">Years Diving</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleSendBuddyRequest}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Send Buddy Request
            </button>
            <button
              onClick={() => onSendMessage && onSendMessage(buddy)}
              className="flex-1 flex items-center justify-center px-4 py-3 border border-slate-500/50 rounded-md text-gray-300 hover:bg-slate-600/30 transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <TabButton tabKey="profile" label="Profile" icon={Award} />
            <TabButton tabKey="dives" label="Recent Dives" icon={Fish} />
            <TabButton tabKey="equipment" label="Equipment" icon={Camera} />
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Bio */}
                {buddy.bio && (
                  <div className="bg-slate-600/30 rounded-lg p-6 border border-slate-500/30">
                    <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                    <p className="text-gray-300 leading-relaxed">{buddy.bio}</p>
                  </div>
                )}

                {/* Certifications */}
                {buddy.certifications && buddy.certifications.length > 0 && (
                  <div className="bg-slate-600/30 rounded-lg p-6 border border-slate-500/30">
                    <h3 className="text-lg font-semibold text-white mb-3">Certifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {buddy.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                          <Award className="w-5 h-5 text-blue-400 mr-3" />
                          <div>
                            <div className="text-white font-medium">{cert.name}</div>
                            {cert.date && (
                              <div className="text-xs text-gray-400">
                                Certified: {new Date(cert.date).getFullYear()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Locations */}
                {buddy.preferredDiveLocations && buddy.preferredDiveLocations.length > 0 && (
                  <div className="bg-slate-600/30 rounded-lg p-6 border border-slate-500/30">
                    <h3 className="text-lg font-semibold text-white mb-3">Preferred Dive Locations</h3>
                    <div className="flex flex-wrap gap-2">
                      {buddy.preferredDiveLocations.map((location, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-2 rounded-md bg-purple-500/20 text-purple-300 text-sm border border-purple-400/30"
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {buddy.interests && buddy.interests.length > 0 && (
                  <div className="bg-slate-600/30 rounded-lg p-6 border border-slate-500/30">
                    <h3 className="text-lg font-semibold text-white mb-3">Diving Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {buddy.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-400/30"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'dives' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-400">Loading recent dives...</p>
                  </div>
                ) : recentDives.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Recent Dive Activity</h3>
                    {recentDives.map((dive, index) => (
                      <div key={index} className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/30">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-white">
                              {dive.location?.name || dive.customLocation || 'Unknown Location'}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {new Date(dive.diveDate).toLocaleDateString()}
                            </p>
                          </div>
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
                        <div className="grid grid-cols-3 gap-4 mb-2">
                          <div className="flex items-center text-sm">
                            <span className="text-gray-400 mr-2">Depth:</span>
                            <span className="text-cyan-400">{dive.maxDepth}m</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-400 mr-2">Time:</span>
                            <span className="text-blue-400">{dive.duration}min</span>
                          </div>
                          {dive.waterTemperature && (
                            <div className="flex items-center text-sm">
                              <Thermometer className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-green-400">{dive.waterTemperature}°C</span>
                            </div>
                          )}
                        </div>
                        {dive.notes && (
                          <p className="text-sm text-gray-300 mt-2">{dive.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Fish className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No recent dive activity to show</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'equipment' && (
              <div className="space-y-6">
                {/* Equipment Available */}
                {buddy.equipment && buddy.equipment.length > 0 ? (
                  <div className="bg-slate-600/30 rounded-lg p-6 border border-slate-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Equipment Available</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {buddy.equipment.map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                          <Camera className="w-4 h-4 text-blue-400 mr-3" />
                          <span className="text-white">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-600/30 rounded-lg p-6 border border-slate-500/30 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No equipment information available</p>
                  </div>
                )}

                {/* Equipment Notes */}
                {buddy.equipmentNotes && (
                  <div className="bg-slate-600/30 rounded-lg p-6 border border-slate-500/30">
                    <h3 className="text-lg font-semibold text-white mb-3">Equipment Notes</h3>
                    <p className="text-gray-300">{buddy.equipmentNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddyProfile;