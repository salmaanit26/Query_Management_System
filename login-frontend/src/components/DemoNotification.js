import React from 'react';
import { AlertCircle, Wifi } from 'lucide-react';

const DemoNotification = () => {
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
