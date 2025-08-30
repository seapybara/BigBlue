// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    
    setIsLoading(true);
    setErrors({});
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Show success message
      console.log('Login successful!');
      // Redirect to original page or dashboard
      navigate(from, { replace: true });
    } else {
      setErrors({ general: result.error });
      setIsLoading(false);
    }
  };

  // Demo account for testing
  const fillDemoAccount = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'Demo123!'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-8">
        <div>
          <div className="flex justify-center">
            <svg viewBox="0 0 28 28" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="10" cy="14" r="7" className="text-cyan-400" />
              <circle cx="18" cy="14" r="7" className="text-cyan-400" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-cyan-400 hover:text-cyan-300">
              Sign up here
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}
          
          {/* Demo Account Button */}
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full bg-slate-700/50 text-gray-300 py-2 rounded-lg text-sm hover:bg-slate-600/50 transition-colors border border-slate-600/50"
          >
            Use Demo Account
          </button>
          
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 bg-slate-700/30 border rounded-lg focus:outline-none focus:ring-2 transition-all text-white placeholder-gray-400 ${
                  errors.email 
                    ? 'border-red-400 focus:ring-red-400/50' 
                    : 'border-slate-600/50 focus:ring-cyan-400/50 focus:border-cyan-400/50'
                }`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 bg-slate-700/30 border rounded-lg focus:outline-none focus:ring-2 transition-all text-white placeholder-gray-400 ${
                  errors.password 
                    ? 'border-red-400 focus:ring-red-400/50' 
                    : 'border-slate-600/50 focus:ring-cyan-400/50 focus:border-cyan-400/50'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          
          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-cyan-500 focus:ring-cyan-400/50 bg-slate-700/30 border-slate-600/50" />
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
              Forgot password?
            </Link>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;