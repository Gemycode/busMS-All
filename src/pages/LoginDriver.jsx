"use client"

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginDriver = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just navigate to driver dashboard
      navigate('/driver-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-brand-medium-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bus text-white text-2xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-brand-dark-blue mb-2">Driver Login</h1>
              <p className="text-gray-600">Access your driver dashboard</p>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-brand-medium-blue hover:bg-brand-dark-blue text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Links */}
                <div className="text-center space-y-2">
                  <Link
                    to="/login"
                    className="block text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
                  >
                    ← Back to Main Login
                  </Link>
                  <Link
                    to="/forgot-password"
                    className="block text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>
            </div>

            {/* Driver Benefits */}
            <div className="mt-8 bg-brand-beige rounded-lg p-6">
              <h3 className="text-lg font-semibold text-brand-dark-blue mb-4">Driver Features</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-brand-medium-blue rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-route text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-700">Manage your assigned routes</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-brand-medium-blue rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-play text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-700">Start and end trips</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-brand-medium-blue rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-map-marker-alt text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-700">Update your location</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-brand-medium-blue rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-users text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-700">View passenger list</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginDriver; 