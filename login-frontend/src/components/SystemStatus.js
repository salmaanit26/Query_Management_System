import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const SystemStatus = () => {
  const [status, setStatus] = useState('checking');
  const [info, setInfo] = useState({});

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/health`);
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
        setInfo(data);
      } else {
        setStatus('DOWN');
      }
    } catch (error) {
      setStatus('DOWN');
    }
  };

  if (status === 'checking') {
    return (
      <div className="flex items-center text-gray-600">
        <Loader className="h-4 w-4 mr-2 animate-spin" />
        <span className="text-sm">Checking system status...</span>
      </div>
    );
  }

  if (status === 'UP') {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="h-4 w-4 mr-2" />
        <span className="text-sm">System operational</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-red-600">
      <AlertCircle className="h-4 w-4 mr-2" />
      <span className="text-sm">System unavailable</span>
    </div>
  );
};

export default SystemStatus;
