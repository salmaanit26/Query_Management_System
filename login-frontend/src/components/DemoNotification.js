import React, { useState, useEffect } from 'react';
import { AlertCircle, Wifi, CheckCircle, Database } from 'lucide-react';

const DemoNotification = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [dbStatus, setDbStatus] = useState('unknown');

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
      const response = await fetch(`${apiUrl}/health`, { 
        method: 'GET',
        timeout: 5000 
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackendStatus('connected');
        setDbStatus(data.database || 'mysql');
      } else {
        setBackendStatus('disconnected');
      }
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  if (backendStatus === 'connected' && dbStatus === 'mysql') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-800">
              Full Features Enabled
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Connected to MySQL database. All features including data persistence, file uploads, and user management are available.
            </p>
          </div>
          <Database className="h-5 w-5 text-green-600" />
        </div>
      </div>
    );
  }

  if (backendStatus === 'connected' && dbStatus === 'sqlite') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Demo Mode - SQLite Database
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Backend is running with SQLite. For production features, configure MySQL database connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <Wifi className="h-5 w-5 text-blue-600 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Demo Mode - Frontend Only
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            You're viewing the frontend interface. Some features require the backend server to be running. 
            For full functionality, start the backend using GitHub Codespaces or local development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoNotification;
