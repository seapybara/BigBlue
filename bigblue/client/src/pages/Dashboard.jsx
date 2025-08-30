import React, { useState, useEffect } from 'react';
import { FaUser, FaWater, FaMapMarkerAlt, FaCalendar, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { diveAPI, buddyAPI, locationAPI } from '../services/api';
import { DiveLogForm } from '../components/DiveLog';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDives: 0,
    sitesVisited: 0,
    buddyRequests: 0,
    totalBottomTime: 0
  });
  const [recentDives, setRecentDives] = useState([]);
  const [upcomingBuddies, setUpcomingBuddies] = useState([]);
  const [showDiveForm, setShowDiveForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchRecentDives(),
        fetchBuddyRequests(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentDives = async () => {
    try {
      const response = await diveAPI.getAll();
      const dives = response.data.data || [];
      setRecentDives(dives.slice(0, 5)); // Get last 5 dives
    } catch (error) {
      console.error('Error fetching recent dives:', error);
      setRecentDives([]);
    }
  };

  const fetchBuddyRequests = async () => {
    try {
      const response = await buddyAPI.getAll();
      const requests = response.data.data || [];
      setUpcomingBuddies(requests.slice(0, 3)); // Get next 3 buddy requests
    } catch (error) {
      console.error('Error fetching buddy requests:', error);
      setUpcomingBuddies([]);
    }
  };

  const fetchStats = async () => {
    try {
      const [divesResponse, buddyResponse] = await Promise.all([
        diveAPI.getStats(),
        buddyAPI.getStats()
      ]);

      const diveStats = divesResponse.data.data || {};
      const buddyStats = buddyResponse.data.data || {};

      setStats({
        totalDives: diveStats.totalDives || user?.numberOfDives || 0,
        sitesVisited: diveStats.uniqueLocations || 0,
        buddyRequests: buddyStats.activeRequests || 0,
        totalBottomTime: diveStats.totalBottomTime || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to user data
      setStats({
        totalDives: user?.numberOfDives || 0,
        sitesVisited: 0,
        buddyRequests: 0,
        totalBottomTime: 0
      });
    }
  };

  const handleDiveFormSave = () => {
    setShowDiveForm(false);
    fetchDashboardData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/80 to-cyan-600/80 backdrop-blur-sm rounded-xl p-8 mb-8 text-white shadow-xl border border-blue-400/30">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'Diver'}!
              </h1>
              <p className="text-gray-300">
                Ready for your next underwater adventure?
              </p>
            </div>
            <button
              onClick={() => setShowDiveForm(true)}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-md transition-all transform hover:scale-105"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Log New Dive
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Dives</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {stats.totalDives}
                </p>
              </div>
              <FaWater className="text-3xl text-cyan-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Certification</p>
                <p className="text-lg font-semibold text-cyan-400">
                  {user?.certificationLevel || 'Open Water'}
                </p>
              </div>
              <FaUser className="text-3xl text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Sites Visited</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.sitesVisited}</p>
              </div>
              <FaMapMarkerAlt className="text-3xl text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Buddy Requests</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.buddyRequests}</p>
              </div>
              <FaCalendar className="text-3xl text-purple-400" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Recent Dives
                </h2>
                <button
                  onClick={() => navigate('/dive-logs')}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View All →
                </button>
              </div>
              
              {recentDives.length > 0 ? (
                <div className="space-y-4">
                  {recentDives.map((dive, index) => (
                    <div key={index} className="flex items-center p-4 bg-slate-600/30 rounded-lg border border-slate-500/30">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mr-4">
                        <FaWater className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">
                          {dive.location?.name || dive.customLocation || 'Unknown Location'}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <span>{new Date(dive.diveDate).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{dive.maxDepth}m</span>
                          <span className="mx-2">•</span>
                          <span>{dive.duration}min</span>
                        </div>
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
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  <FaWater className="text-5xl mx-auto mb-3 text-gray-500" />
                  <p>No recent dives logged</p>
                  <p className="text-sm mt-2">Start logging your dives to see them here!</p>
                  <button
                    onClick={() => setShowDiveForm(true)}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all"
                  >
                    Log Your First Dive
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Buddy Requests */}
          <div>
            <div className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Upcoming Dives
                </h2>
                <button
                  onClick={() => navigate('/buddy-board')}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View All →
                </button>
              </div>
              
              {upcomingBuddies.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBuddies.map((request, index) => (
                    <div key={index} className="p-4 bg-slate-600/30 rounded-lg border border-slate-500/30">
                      <div className="flex items-center mb-2">
                        <FaCalendar className="text-cyan-400 mr-2" />
                        <span className="text-white font-medium">
                          {request.location?.name || 'Custom Location'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">
                        {new Date(request.diveDate).toLocaleDateString()} at {request.diveTime}
                      </div>
                      <div className="text-sm text-gray-300">
                        with {request.requester?.name || 'Unknown Buddy'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  <FaCalendar className="text-5xl mx-auto mb-3 text-gray-500" />
                  <p>No upcoming dives</p>
                  <p className="text-sm mt-2">Find a buddy to plan your next dive!</p>
                  <button
                    onClick={() => navigate('/buddy-board')}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all"
                  >
                    Find Dive Buddy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dive Log Form Modal */}
        {showDiveForm && (
          <DiveLogForm
            onClose={() => setShowDiveForm(false)}
            onSave={handleDiveFormSave}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;