import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle,
  Clock,
  User,
  Tag,
  AlertCircle,
  Calendar,
  Camera,
  Upload,
  X,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

const WorkerDashboard = () => {
  const { user, isWorker } = useAuth();
  const [assignedQueries, setAssignedQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingQuery, setCompletingQuery] = useState(null);
  const [completionData, setCompletionData] = useState({
    notes: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const priorities = {
    LOW: { label: 'Low', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
    MEDIUM: { label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
    HIGH: { label: 'High', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
    URGENT: { label: 'Urgent', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
  };

  const statuses = {
    PENDING: { label: 'Pending', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' },
    ASSIGNED: { label: 'Assigned', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
    RESOLVED: { label: 'Resolved', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' }
  };

  useEffect(() => {
    if (isWorker && user?.id) {
      fetchAssignedQueries();
    }
  }, [isWorker, user]);

  const fetchAssignedQueries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/queries/worker/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAssignedQueries(data);
      } else {
        setError('Failed to fetch assigned queries');
      }
    } catch (error) {
      console.error('Error fetching assigned queries:', error);
      setError('Network error while fetching queries');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        setCompletionData({ ...completionData, image: file });
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
    setCompletionData({ ...completionData, image: null });
    setImagePreview(null);
  };

  const markAsInProgress = async (queryId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/queries/${queryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'IN_PROGRESS',
          userId: user.id,
          comment: 'Worker started working on this query'
        }),
      });

      if (response.ok) {
        fetchAssignedQueries(); // Refresh the list
      } else {
        setError('Failed to update query status');
      }
    } catch (error) {
      console.error('Error updating query status:', error);
      setError('Network error while updating status');
    }
  };

  const completeQuery = async () => {
    if (!completingQuery) return;

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      if (completionData.notes) {
        formData.append('completionNotes', completionData.notes);
      }
      if (completionData.image) {
        formData.append('completionImage', completionData.image);
      }

      const response = await fetch(`http://localhost:8080/api/queries/${completingQuery.id}/complete`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setCompletingQuery(null);
        setCompletionData({ notes: '', image: null });
        setImagePreview(null);
        fetchAssignedQueries(); // Refresh the list
      } else {
        setError('Failed to complete query');
      }
    } catch (error) {
      console.error('Error completing query:', error);
      setError('Network error while completing query');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isWorker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to workers.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your assigned queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assigned Queries</h1>
          <p className="text-gray-600">Track and complete your assigned work orders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <p className="ml-3 text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{assignedQueries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignedQueries.filter(q => q.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignedQueries.filter(q => q.status === 'RESOLVED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Queries List */}
        <div className="space-y-6">
          {assignedQueries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Queries</h3>
              <p className="text-gray-600">You don't have any queries assigned to you yet.</p>
            </div>
          ) : (
            assignedQueries.map((query) => {
              const priorityStyle = priorities[query.priority] || priorities.MEDIUM;
              const statusStyle = statuses[query.status] || statuses.PENDING;

              return (
                <div key={query.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{query.title}</h3>
                            <p className="text-gray-600 mb-4">{query.description}</p>
                          </div>
                          {query.imagePath && (
                            <div className="ml-4 flex-shrink-0">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                <img
                                  src={`http://localhost:8080${query.imagePath}`}
                                  alt="Query attachment"
                                  className="w-full h-full object-cover"
                                  onClick={() => window.open(`http://localhost:8080${query.imagePath}`, '_blank')}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          {/* Category */}
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-sm font-medium text-gray-700">{query.category}</span>
                          </div>

                          {/* Priority */}
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyle.textColor} ${priorityStyle.bgColor}`}>
                            <div className={`w-2 h-2 rounded-full ${priorityStyle.color} mr-1`}></div>
                            {priorityStyle.label}
                          </div>

                          {/* Status */}
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.textColor} ${statusStyle.bgColor}`}>
                            <span>{statusStyle.label}</span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(query.createdAt)}
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t pt-4 mt-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-500">Query ID:</span>
                              <span className="ml-1 text-gray-900">#{query.id}</span>
                            </div>
                            {query.venue && (
                              <div>
                                <span className="font-medium text-gray-500">Venue:</span>
                                <span className="ml-1 text-gray-900">{query.venue.name}</span>
                              </div>
                            )}
                            {query.resolvedAt && (
                              <div>
                                <span className="font-medium text-gray-500">Completed:</span>
                                <span className="ml-1 text-gray-900">{formatDate(query.resolvedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t pt-4 mt-4">
                          <div className="flex items-center gap-3">
                            {query.status === 'ASSIGNED' && (
                              <button
                                onClick={() => markAsInProgress(query.id)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Start Working
                              </button>
                            )}
                            
                            {(query.status === 'ASSIGNED' || query.status === 'IN_PROGRESS') && (
                              <button
                                onClick={() => setCompletingQuery(query)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {completingQuery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Complete Query #{completingQuery.id}
                </h3>
                <button
                  onClick={() => {
                    setCompletingQuery(null);
                    setCompletionData({ notes: '', image: null });
                    setImagePreview(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Title:</strong> {completingQuery.title}
                </p>
              </div>

              {/* Completion Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Notes (Optional)
                </label>
                <textarea
                  value={completionData.notes}
                  onChange={(e) => setCompletionData({ ...completionData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe what was done to resolve this query..."
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Image (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </button>
                  <label className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Completion preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setCompletingQuery(null);
                    setCompletionData({ notes: '', image: null });
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  onClick={completeQuery}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
