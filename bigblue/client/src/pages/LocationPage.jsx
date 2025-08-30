import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaWater, FaStar, FaThermometerHalf, FaEye, FaHeart, FaRegHeart } from 'react-icons/fa';
import { locationAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const LocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocation();
  }, [id]);

  const fetchLocation = async () => {
    try {
      const response = await locationAPI.getOne(id);
      setLocation(response.data.data);
    } catch (error) {
      toast.error('Failed to load location details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg viewBox="0 0 28 28" className="w-16 h-16 animate-bounce" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="10" cy="14" r="7" className="text-cyan-400" />
          <circle cx="18" cy="14" r="7" className="text-cyan-400" />
        </svg>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/80 to-cyan-600/80 backdrop-blur-sm rounded-xl p-8 mb-8 text-white shadow-xl border border-blue-400/30">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-4xl font-bold">{location.name}</h1>
            <button
              onClick={async () => {
                try {
                  if (isFavorite(location._id)) {
                    await removeFromFavorites(location._id);
                    toast.success('Removed from favorites');
                  } else {
                    await addToFavorites(location._id);
                    toast.success('Added to favorites');
                  }
                } catch (error) {
                  console.error('Error toggling favorite:', error);
                  toast.error('Failed to update favorites');
                }
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors ml-4 flex-shrink-0"
              title={isFavorite(location._id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite(location._id) ? (
                <FaHeart className="text-red-400 w-6 h-6" />
              ) : (
                <FaRegHeart className="text-white hover:text-red-300 w-6 h-6" />
              )}
            </button>
          </div>
          <div className="flex items-center text-xl mb-2">
            <FaMapMarkerAlt className="mr-3 text-cyan-300" />
            <span>{location.country} • {location.region}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full capitalize">
              {location.difficulty}
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              {location.depth?.min}-{location.depth?.max}m
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <div className="w-1 h-6 bg-cyan-400 rounded mr-3"></div>
                About This Site
              </h2>
              <p className="text-gray-300 leading-relaxed">{location.description}</p>
            </div>

            {/* Dive Conditions */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <div className="w-1 h-6 bg-cyan-400 rounded mr-3"></div>
                Dive Conditions
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <FaWater className="text-cyan-400 mr-4 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-400">Depth Range</p>
                    <p className="font-semibold text-white text-lg">{location.depth.min}-{location.depth.max}m</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <FaEye className="text-blue-400 mr-4 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-400">Visibility</p>
                    <p className="font-semibold text-white text-lg capitalize">{location.visibility}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <FaThermometerHalf className="text-red-400 mr-4 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-400">Water Temp</p>
                    <p className="font-semibold text-white text-lg">
                      {location.waterTemperature?.summer?.min}-{location.waterTemperature?.summer?.max}°C
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <FaStar className="text-amber-400 mr-4 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-400">Rating</p>
                    <p className="font-semibold text-white text-lg">
                      {location.rating?.average?.toFixed(1) || 'N/A'} ({location.rating?.count || 0} reviews)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Marine Life */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <div className="w-1 h-6 bg-cyan-400 rounded mr-3"></div>
                Marine Life
              </h2>
              <div className="flex flex-wrap gap-3">
                {location.marineLife?.map((species, index) => (
                  <span key={index} className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm border border-cyan-500/30 hover:border-cyan-400/50 transition-colors">
                    {species}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <div className="w-1 h-6 bg-cyan-400 rounded mr-3"></div>
                Features
              </h2>
              <div className="flex flex-wrap gap-3">
                {location.features?.map((feature, index) => (
                  <span key={index} className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 text-gray-200 px-4 py-2 rounded-full text-sm border border-slate-500/30 capitalize">
                    {feature.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className="w-1 h-4 bg-cyan-400 rounded mr-2"></div>
                Quick Info
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <p className="text-sm text-gray-400">Difficulty</p>
                  <p className="font-semibold text-white capitalize">{location.difficulty}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <p className="text-sm text-gray-400">Entry Type</p>
                  <p className="font-semibold text-white capitalize">{location.entryType}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <p className="text-sm text-gray-400">Current Strength</p>
                  <p className="font-semibold text-white capitalize">{location.currentStrength}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <p className="text-sm text-gray-400">Certification Required</p>
                  <p className="font-semibold text-white">{location.certificationRequired}</p>
                </div>
              </div>
            </div>

            {/* Best Months */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className="w-1 h-4 bg-cyan-400 rounded mr-2"></div>
                Best Time to Visit
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => {
                  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  const isBest = location.bestMonths?.includes(month);
                  return (
                    <div
                      key={month}
                      className={`text-center py-2 rounded-lg transition-colors ${
                        isBest 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md' 
                          : 'bg-slate-700/50 text-gray-400 border border-slate-600/30'
                      }`}
                    >
                      <p className="text-xs font-semibold">{monthNames[month-1]}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl p-6">
              <button
                onClick={() => navigate('/buddy-board')}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Find a Buddy for This Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;