import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaLock, FaMapMarkerAlt, FaCertificate, FaWater } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    certificationLevel: '',
    experienceLevel: '',
    numberOfDives: 0
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        certificationLevel: user.certificationLevel || 'Open Water',
        experienceLevel: user.experienceLevel || 'beginner',
        numberOfDives: user.numberOfDives || 0
      });
    }
  }, [user]);

  // Certification levels
  const certificationLevels = [
    'Open Water',
    'Advanced Open Water',
    'Rescue Diver',
    'Dive Master',
    'Instructor',
    'Technical Diver'
  ];

  // Experience levels
  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-25 dives)' },
    { value: 'intermediate', label: 'Intermediate (25-100 dives)' },
    { value: 'advanced', label: 'Advanced (100+ dives)' },
    { value: 'expert', label: 'Expert (500+ dives)' }
  ];

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePersonalInfo = () => {
    if (!personalInfo.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!personalInfo.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return false;
    }
    if (!passwordData.newPassword) {
      toast.error('New password is required');
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return false;
    }
    return true;
  };

  const handleSavePersonalInfo = async () => {
    if (!validatePersonalInfo()) return;

    setLoading(true);
    try {
      const response = await authAPI.updateProfile(personalInfo);
      
      if (response.data.success) {
        updateUser(response.data.data);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      const response = await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        toast.success('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setPersonalInfo({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        certificationLevel: user.certificationLevel || 'Open Water',
        experienceLevel: user.experienceLevel || 'beginner',
        numberOfDives: user.numberOfDives || 0
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/80 to-cyan-600/80 backdrop-blur-sm rounded-xl p-8 mb-8 text-white shadow-xl border border-blue-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-6">
                <FaUser className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name || 'Your Profile'}</h1>
                <p className="text-cyan-100">{user?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {user?.certificationLevel || 'Open Water'}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {user?.numberOfDives || 0} dives
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'personal', label: 'Personal Info', icon: FaUser },
            { id: 'security', label: 'Security', icon: FaLock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
              }`}
            >
              <tab.icon className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl p-8">
          {activeTab === 'personal' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <div className="w-1 h-6 bg-cyan-400 rounded mr-3"></div>
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSavePersonalInfo}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                    >
                      <FaSave className="mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., San Diego, CA"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Diving Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Certification Level
                    </label>
                    <select
                      value={personalInfo.certificationLevel}
                      onChange={(e) => handlePersonalInfoChange('certificationLevel', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50"
                    >
                      {certificationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Experience Level
                    </label>
                    <select
                      value={personalInfo.experienceLevel}
                      onChange={(e) => handlePersonalInfoChange('experienceLevel', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Number of Dives
                    </label>
                    <input
                      type="number"
                      value={personalInfo.numberOfDives}
                      onChange={(e) => handlePersonalInfoChange('numberOfDives', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      min="0"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Bio (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    value={personalInfo.bio}
                    onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell other divers about yourself, your diving interests, and experience..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <div className="w-1 h-6 bg-cyan-400 rounded mr-3"></div>
                Change Password
              </h2>

              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>

              <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <h3 className="text-yellow-400 font-medium mb-2">Password Requirements</h3>
                <ul className="text-yellow-300/80 text-sm space-y-1">
                  <li>• Must be at least 6 characters long</li>
                  <li>• Should contain a mix of letters and numbers</li>
                  <li>• Avoid using common passwords</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;