import React from 'react';
import { FaMapMarkerAlt, FaWater, FaStar, FaUserFriends, FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getDifficultyBackgroundClasses, formatDifficulty } from '../../utils/difficultyUtils';

const LocationPopup = ({ location, onDetailsClick }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  // Add comprehensive null check
  if (!location) {
    return (
      <div className="p-3 min-w-[250px]">
        <p className="text-gray-500">Loading location...</p>
      </div>
    );
  }

  // Use utility functions for difficulty styling

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    try {
      if (isFavorite(location._id)) {
        await removeFromFavorites(location._id);
      } else {
        await addToFavorites(location._id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="p-4 min-w-[280px] bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-blue-500/20 rounded-lg">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-xl text-white">
            {location.name || 'Unknown Location'}
          </h3>
          <button
            onClick={handleFavoriteToggle}
            className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
            title={isFavorite(location._id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite(location._id) ? (
              <FaHeart className="text-red-500 w-5 h-5" />
            ) : (
              <FaRegHeart className="text-gray-400 hover:text-red-400 w-5 h-5" />
            )}
          </button>
        </div>
        <div className="flex items-center text-sm text-gray-300 mb-3">
          <FaMapMarkerAlt className="mr-2 text-cyan-400" />
          <span>{location.country || 'Unknown'} • {location.region || 'Unknown'}</span>
        </div>
        {location.difficulty && (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border border-opacity-20 ${getDifficultyBackgroundClasses(location.difficulty)}`}>
            {formatDifficulty(location.difficulty)}
          </span>
        )}
      </div>

      {/* Quick Info */}
      <div className="space-y-3 mb-4">
        {location.depth && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-300">
              <FaWater className="mr-2 text-cyan-400" />
              Depth
            </span>
            <span className="font-semibold text-white">
              {location.depth.min || 0}-{location.depth.max || 0}m
            </span>
          </div>
        )}
        
        {location.rating && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-300">
              <FaStar className="mr-2 text-amber-400" />
              Rating
            </span>
            <span className="font-semibold text-white">
              {(location.rating.average || 0).toFixed(1)} ({location.rating.count || 0} reviews)
            </span>
          </div>
        )}

        {location.upcomingBuddyRequests && location.upcomingBuddyRequests.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-300">
              <FaUserFriends className="mr-2 text-red-400" />
              Buddy Requests
            </span>
            <span className="font-semibold text-red-400">
              {location.upcomingBuddyRequests.length} active
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      {location.features && location.features.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">Features:</p>
          <div className="flex flex-wrap gap-2">
            {location.features.slice(0, 4).map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-slate-700/50 text-gray-200 px-2 py-1 rounded-md border border-slate-600/30"
              >
                {(feature || '').replace('_', ' ')}
              </span>
            ))}
            {location.features.length > 4 && (
              <span className="text-xs text-gray-400">
                +{location.features.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Marine Life Preview */}
      {location.marineLife && location.marineLife.length > 0 && (
        <div className="mb-4 text-sm">
          <p className="text-gray-300 mb-2">Marine Life:</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {location.marineLife.slice(0, 3).join(', ')}
            {location.marineLife.length > 3 && '...'}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2 pt-2 border-t border-slate-600/50">
        <button
          onClick={() => onDetailsClick && onDetailsClick(location)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-700 transition-all flex items-center justify-center"
        >
          View Details
          <FaArrowRight className="ml-2" />
        </button>
        <button
          onClick={() => console.log('Find buddy for', location?.name)}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-pink-700 transition-all"
        >
          Find Buddy
        </button>
      </div>
    </div>
  );
};

export default LocationPopup;