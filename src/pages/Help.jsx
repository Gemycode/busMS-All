"use client"

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Help = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to settings page where help functionality is now located
    navigate('/settings', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Settings...</p>
      </div>
    </div>
  );
};

export default Help; 