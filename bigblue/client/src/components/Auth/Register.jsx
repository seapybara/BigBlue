import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaUser, FaMedal, FaWater } from 'react-icons/fa';
import { authAPI } from '../../services/api';
import { setAuthToken, setUser } from '../../services/auth';

const Register = ({ setUser: setAppUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    certificationLevel: 'Open Water',
    experienceLevel: 'beginner',
    numberOfDives: 0,
    bio: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await authAPI.register(dataToSend);
      const { token, user } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      setUser(user);
      setAppUser(user);
      
      toast.success(`Welcome to BigBlue, ${user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-8">
        <div>
          <div className="flex justify-center">
            <svg viewBox="0 0 28 28" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="10" cy="14" r="7" className="text-cyan-400" />
              <circle cx="18" cy="14" r="7" className="text-cyan-400" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Join the BigBlue Community
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
              Sign in here
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all text-white placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all text-white placeholder-gray-400"
                placeholder="diver@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all text-white placeholder-gray-400"
                placeholder="Min. 6 characters"
                minLength="6"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all text-white placeholder-gray-400"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Certification Level */}
          <div>
            <label htmlFor="certificationLevel" className="block text-sm font-medium text-gray-300">
              Certification Level
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMedal className="text-gray-400" />
              </div>
              <select
                id="certificationLevel"
                name="certificationLevel"
                value={formData.certificationLevel}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all text-white placeholder-gray-400"
                required
              >
                <option value="Open Water">Open Water</option>
                <option value="Advanced Open Water">Advanced Open Water</option>
                <option value="Rescue Diver">Rescue Diver</option>
                <option value="Dive Master">Dive Master</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-300">
              Experience Level
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaWater className="text-gray-400" />
              </div>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all text-white placeholder-gray-400"
                required
              >
                <option value="beginner">Beginner (0-25 dives)</option>
                <option value="intermediate">Intermediate (25-100 dives)</option>
                <option value="advanced">Advanced (100-500 dives)</option>
                <option value="expert">Expert (500+ dives)</option>
              </select>
            </div>
          </div>

          {/* Number of Dives */}
          <div>
            <label htmlFor="numberOfDives" className="block text-sm font-medium text-gray-300">
              Number of Dives
            </label>
            <input
              id="numberOfDives"
              name="numberOfDives"
              type="number"
              min="0"
              value={formData.numberOfDives}
              onChange={handleChange}
              className="w-full pr-3 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all text-white placeholder-gray-400"
              placeholder="0"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400/50 transition-all transform hover:scale-105 disabled:transform-none ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;