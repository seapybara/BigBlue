import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Users, Fish, Thermometer, Eye } from 'lucide-react';

const LocationCard = ({ location, onLocationClick, showBuddyCount = true, compact = false }) => {
  const navigate = useNavigate();

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

  const handleClick = (e) => {
    e.preventDefault();
    if (onLocationClick) {
      onLocationClick(location);
    } else {
      navigate(`/locations/${location._id}`);
    }
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    navigate(`/locations/${location._id}`);
  };

  if (compact) {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm rounded-lg border border-cyan-400/20 hover:border-cyan-400/40 transition-all p-4 cursor-pointer hover:transform hover:scale-[1.02]"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white text-sm truncate">{location.name}</h3>
          <span className={`px-2 py-1 rounded text-xs border ${getDifficultyColor(location.difficulty)}`}>
            {location.difficulty}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-2">{location.country}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-300">{location.depth.min}-{location.depth.max}m</span>
          {location.averageRating && (
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-400 mr-1" />
              <span className="text-white">{location.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all p-6 shadow-lg cursor-pointer hover:transform hover:scale-[1.02]"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{location.name}</h3>
          <div className="flex items-center text-gray-300 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{location.region}, {location.country}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getDifficultyColor(location.difficulty)}`}>
          {location.difficulty}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-cyan-400">{location.depth.min}-{location.depth.max}m</div>
          <div className="text-xs text-gray-400">Depth Range</div>
        </div>
        {location.averageRating ? (
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-lg font-bold text-white">{location.averageRating.toFixed(1)}</span>
            </div>
            <div className="text-xs text-gray-400">Rating ({location.reviewCount || 0})</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-lg font-bold text-gray-400">--</div>
            <div className="text-xs text-gray-400">No Rating</div>
          </div>
        )}
      </div>

      {/* Features */}
      {location.features && location.features.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {location.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs border border-purple-400/30"
              >
                {feature}
              </span>
            ))}
            {location.features.length > 3 && (
              <span className="inline-block px-2 py-1 rounded-md bg-slate-600/60 text-gray-300 text-xs border border-slate-400/30">
                +{location.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Marine Life Preview */}
      {location.marineLife && location.marineLife.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center text-xs text-gray-400 mb-2">
            <Fish className="w-3 h-3 mr-1" />
            <span>Marine Life ({location.marineLife.length} species)</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {location.marineLife.slice(0, 2).map((species, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-400/30"
              >
                {species}
              </span>
            ))}
            {location.marineLife.length > 2 && (
              <span className="inline-block px-2 py-1 rounded-md bg-slate-600/60 text-gray-300 text-xs border border-slate-400/30">
                +{location.marineLife.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bottom Info */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-600/50">
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          {location.averageTemp && (
            <div className="flex items-center">
              <Thermometer className="w-3 h-3 mr-1" />
              <span>{location.averageTemp}°C</span>
            </div>
          )}
          {location.averageVisibility && (
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              <span>{location.averageVisibility}m</span>
            </div>
          )}
        </div>
        
        {showBuddyCount && (
          <div className="flex items-center text-xs">
            <Users className="w-3 h-3 mr-1 text-gray-400" />
            <span className="text-cyan-400 font-medium">
              {location.activeBuddyRequests || 0} active buddies
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCard;