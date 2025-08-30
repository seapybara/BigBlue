import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Thermometer, Eye, Waves, Camera, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { locationAPI, diveAPI } from '../../services/api';

const DiveLogForm = ({ onClose, onSave, editDive = null }) => {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    locationId: '',
    customLocation: '',
    diveDate: '',
    diveTime: '',
    duration: '',
    maxDepth: '',
    avgDepth: '',
    waterTemperature: '',
    visibility: '',
    conditions: {
      weather: '',
      current: '',
      waves: ''
    },
    equipment: {
      tank: '',
      suit: '',
      weight: ''
    },
    marineLifeSeen: [],
    notes: '',
    rating: 5,
    photos: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLocations();
    if (editDive) {
      populateFormWithDive(editDive);
    }
  }, [editDive]);

  const fetchLocations = async () => {
    try {
      const response = await locationAPI.getAll();
      setLocations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load dive locations');
    }
  };

  const populateFormWithDive = (dive) => {
    setFormData({
      locationId: dive.locationId || '',
      customLocation: dive.customLocation || '',
      diveDate: dive.diveDate ? new Date(dive.diveDate).toISOString().split('T')[0] : '',
      diveTime: dive.diveTime || '',
      duration: dive.duration || '',
      maxDepth: dive.maxDepth || '',
      avgDepth: dive.avgDepth || '',
      waterTemperature: dive.waterTemperature || '',
      visibility: dive.visibility || '',
      conditions: dive.conditions || { weather: '', current: '', waves: '' },
      equipment: dive.equipment || { tank: '', suit: '', weight: '' },
      marineLifeSeen: dive.marineLifeSeen || [],
      notes: dive.notes || '',
      rating: dive.rating || 5,
      photos: dive.photos || []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMarineLifeChange = (species) => {
    const newSpecies = species.trim();
    if (newSpecies && !formData.marineLifeSeen.includes(newSpecies)) {
      setFormData(prev => ({
        ...prev,
        marineLifeSeen: [...prev.marineLifeSeen, newSpecies]
      }));
    }
  };

  const removeMarineLife = (species) => {
    setFormData(prev => ({
      ...prev,
      marineLifeSeen: prev.marineLifeSeen.filter(s => s !== species)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.locationId && !formData.customLocation) {
      newErrors.location = 'Please select a location or enter a custom location';
    }

    if (!formData.diveDate) {
      newErrors.diveDate = 'Dive date is required';
    }

    if (!formData.maxDepth || formData.maxDepth <= 0) {
      newErrors.maxDepth = 'Max depth is required and must be greater than 0';
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duration is required and must be greater than 0';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const diveData = {
        ...formData,
        maxDepth: parseFloat(formData.maxDepth),
        avgDepth: parseFloat(formData.avgDepth) || null,
        duration: parseInt(formData.duration),
        waterTemperature: parseFloat(formData.waterTemperature) || null,
        visibility: parseFloat(formData.visibility) || null
      };

      let response;
      if (editDive) {
        response = await diveAPI.update(editDive._id, diveData);
      } else {
        response = await diveAPI.create(diveData);
      }

      toast.success(`Dive ${editDive ? 'updated' : 'logged'} successfully!`);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error saving dive:', error);
      toast.error(error.response?.data?.message || 'Failed to save dive log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editDive ? 'Edit Dive Log' : 'Log New Dive'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Dive Location
                </label>
                <select
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                >
                  <option value="">Select a location</option>
                  {locations.map(location => (
                    <option key={location._id} value={location._id}>
                      {location.name}, {location.country}
                    </option>
                  ))}
                </select>
                {errors.location && (
                  <p className="mt-1 text-red-400 text-sm">{errors.location}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Location (if not listed)
                </label>
                <input
                  type="text"
                  name="customLocation"
                  value={formData.customLocation}
                  onChange={handleInputChange}
                  placeholder="Enter custom location"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Dive Date
                </label>
                <input
                  type="date"
                  name="diveDate"
                  value={formData.diveDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                />
                {errors.diveDate && (
                  <p className="mt-1 text-red-400 text-sm">{errors.diveDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Dive Time
                </label>
                <input
                  type="time"
                  name="diveTime"
                  value={formData.diveTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="45"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                />
                {errors.duration && (
                  <p className="mt-1 text-red-400 text-sm">{errors.duration}</p>
                )}
              </div>
            </div>

            {/* Depth and Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Depth (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="maxDepth"
                  value={formData.maxDepth}
                  onChange={handleInputChange}
                  placeholder="18.5"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                />
                {errors.maxDepth && (
                  <p className="mt-1 text-red-400 text-sm">{errors.maxDepth}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Avg Depth (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="avgDepth"
                  value={formData.avgDepth}
                  onChange={handleInputChange}
                  placeholder="12.0"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Thermometer className="inline w-4 h-4 mr-1" />
                  Water Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="waterTemperature"
                  value={formData.waterTemperature}
                  onChange={handleInputChange}
                  placeholder="24.5"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Eye className="inline w-4 h-4 mr-1" />
                  Visibility (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  placeholder="15"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weather</label>
                  <select
                    name="conditions.weather"
                    value={formData.conditions.weather}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  >
                    <option value="">Select weather</option>
                    <option value="sunny">Sunny</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="overcast">Overcast</option>
                    <option value="rainy">Rainy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current</label>
                  <select
                    name="conditions.current"
                    value={formData.conditions.current}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  >
                    <option value="">Select current</option>
                    <option value="none">None</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="strong">Strong</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Waves className="inline w-4 h-4 mr-1" />
                    Wave Conditions
                  </label>
                  <select
                    name="conditions.waves"
                    value={formData.conditions.waves}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  >
                    <option value="">Select waves</option>
                    <option value="calm">Calm</option>
                    <option value="small">Small</option>
                    <option value="moderate">Moderate</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Marine Life */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Marine Life Observed
              </label>
              <input
                type="text"
                placeholder="Enter species name and press Enter"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleMarineLifeChange(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.marineLifeSeen.map((species, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-400/30"
                  >
                    {species}
                    <button
                      type="button"
                      onClick={() => removeMarineLife(species)}
                      className="ml-2 text-cyan-300 hover:text-cyan-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dive Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-600'
                    } hover:text-yellow-400 transition`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                placeholder="Add any additional notes about your dive..."
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-slate-500/50 rounded-md text-gray-300 hover:bg-slate-600/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {editDive ? 'Update Dive' : 'Log Dive'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiveLogForm;