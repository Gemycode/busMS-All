"use client"

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/userSlice';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    
    dispatch(loginUser({ email: formData.email, password: formData.password }))
      .unwrap()
      .then((response) => {
        if (response.user && (response.user.role === 'admin' || response.user.role === 'manager')) {
          navigate('/admin-dashboard');
        } else {
          setErrors({ general: 'Access denied. Only admins and managers are allowed.' });
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        setErrors({ general: error.message || 'Login failed. Please check your credentials.' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-brand-dark-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-brand-dark-blue mb-2">Admin Login</h1>
              <p className="text-gray-600">Access the administration panel</p>
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark-blue ${
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark-blue ${
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
                  className="w-full px-6 py-3 bg-brand-dark-blue hover:bg-blue-800 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Admin Features */}
            <div className="mt-8 bg-brand-beige rounded-lg p-6">
              <h3 className="text-lg font-semibold text-brand-dark-blue mb-4">Admin Features</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-brand-dark-blue rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-users-cog text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-700">Manage all users and roles</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-brand-dark-blue rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-bus text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-700">Control bus fleet and routes</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-brand-dark-blue rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-chart-bar text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-700">View analytics and reports</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-brand-dark-blue rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-cog text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-700">System configuration</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-blue-500 mt-1 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Security Notice</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This is a restricted area. Only authorized administrators can access this panel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin; 