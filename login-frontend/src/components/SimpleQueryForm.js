import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X } from 'lucide-react';

const SimpleQueryForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
    venueId: ''
  });
  const [venues, setVenues] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const categories = [
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'CARPENTRY', label: 'Carpentry' },
    { value: 'NETWORK', label: 'Network/IT' },
    { value: 'CLEANING', label: 'Cleaning' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'SECURITY', label: 'Security' },
    { value: 'OTHER', label: 'Other' }
  ];

  // Fetch venues on component mount
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/venues');
        if (response.ok) {
          const venueData = await response.json();
          setVenues(venueData);
        } else {
          console.error('Failed to fetch venues');
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  const priorities = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setError('');
      } else {
        setError('Please select an image file under 5MB.');
      }
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => handleImageSelect(e);
    input.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priority', formData.priority);
      
      // Add venue if selected
      if (formData.venueId) {
        formDataToSend.append('venueId', formData.venueId);
      }
      
      // Add image if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch('http://localhost:8080/api/queries/anonymous', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccess('Query submitted successfully! Redirecting to dashboard...');
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          priority: 'MEDIUM',
          venueId: ''
        });
        setImageFile(null);
        setImagePreview(null);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Failed to submit query. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Submit New Query</h1>
            <p className="text-gray-600 text-lg">
              Describe your issue and we'll help you resolve it quickly
            </p>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <span className="text-red-500 mr-1">*</span>
              <span>Required fields</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Brief description of your issue"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Provide detailed information about your issue"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Venue Selection */}
            <div>
              <label htmlFor="venueId" className="block text-sm font-medium text-gray-700 mb-2">
                Venue Location
                <span className="text-gray-500 ml-1">(Optional)</span>
              </label>
              <select
                id="venueId"
                name="venueId"
                value={formData.venueId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a venue (optional)</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.location}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Select the venue where the issue is located, or leave blank for general queries
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Image
                <span className="text-gray-500 ml-1">(Optional)</span>
              </label>
              <div className="space-y-4">
                {!imagePreview && (
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleCameraCapture}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="h-5 w-5 mr-2 text-gray-500" />
                      Take Photo
                    </button>
                    <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <Upload className="h-5 w-5 mr-2 text-gray-500" />
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
                
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Add a photo to help explain the issue (max 5MB)
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Query'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              🔒 Your submission is completely anonymous. No personal information is collected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleQueryForm;
