import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Filter,
  FileText,
  Clock,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Users,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  UserPlus,
  X
} from 'lucide-react';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'CARPENTRY', label: 'Carpentry Works' },
    { value: 'NETWORK', label: 'Network/IT' },
    { value: 'CLEANING', label: 'Cleaning' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'OTHER', label: 'Other' }
  ];

  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'LOW', label: 'Low', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
    { value: 'URGENT', label: 'Urgent', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
  ];

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'PENDING', label: 'Pending', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' },
    { value: 'ASSIGNED', label: 'Assigned', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
    { value: 'RESOLVED', label: 'Resolved', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
    { value: 'CLOSED', label: 'Closed', color: 'bg-gray-600', textColor: 'text-gray-700', bgColor: 'bg-gray-100' }
  ];

  useEffect(() => {
    fetchQueries();
    if (isAdmin) {
      fetchWorkers();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterQueries();
  }, [queries, searchTerm, selectedCategory, selectedPriority, selectedStatus]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/queries');
      
      if (response.ok) {
        const data = await response.json();
        setQueries(Array.isArray(data) ? data : []);
        setError('');
      } else {
        setError('Failed to fetch queries');
        setQueries([]);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      setError('Network error. Please check if the server is running.');
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/workers');
      if (response.ok) {
        const data = await response.json();
        setWorkers(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch workers');
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const deleteQuery = async (queryId) => {
    if (!window.confirm('Are you sure you want to delete this query?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/queries/${queryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQueries(queries.filter(q => q.id !== queryId));
      } else {
        setError('Failed to delete query');
      }
    } catch (error) {
      console.error('Error deleting query:', error);
      setError('Network error while deleting query');
    }
  };

  const assignWorker = async (queryId, workerId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/queries/${queryId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workerId }),
      });

      if (response.ok) {
        const updatedQuery = await response.json();
        setQueries(queries.map(q => q.id === queryId ? updatedQuery : q));
        setShowAssignModal(false);
        setSelectedQuery(null);
      } else {
        setError('Failed to assign worker');
      }
    } catch (error) {
      console.error('Error assigning worker:', error);
      setError('Network error while assigning worker');
    }
  };

  const getFilteredWorkers = (category) => {
    const categoryMapping = {
      'ELECTRICAL': 'ELECTRICIAN',
      'PLUMBING': 'PLUMBER',
      'CARPENTRY': 'CARPENTER',
      'NETWORK': 'NETWORK',
      'CLEANING': 'GENERAL',
      'MAINTENANCE': 'GENERAL',
      'SECURITY': 'GENERAL',
      'OTHER': 'GENERAL'
    };

    const workerType = categoryMapping[category] || 'GENERAL';
    return workers.filter(worker => worker.workerType === workerType || workerType === 'GENERAL');
  };

  const filterQueries = () => {
    let filtered = queries;

    if (searchTerm) {
      filtered = filtered.filter(query =>
        query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(query => query.category === selectedCategory);
    }

    if (selectedPriority) {
      filtered = filtered.filter(query => query.priority === selectedPriority);
    }

    if (selectedStatus) {
      filtered = filtered.filter(query => query.status === selectedStatus);
    }

    setFilteredQueries(filtered);
  };

  const getPriorityStyle = (priority) => {
    const priorityInfo = priorities.find(p => p.value === priority);
    return priorityInfo || { color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' };
  };

  const getStatusStyle = (status) => {
    const statusInfo = statuses.find(s => s.value === status);
    return statusInfo || { color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'ASSIGNED':
        return <User className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <TrendingUp className="h-4 w-4" />;
      case 'RESOLVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CLOSED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatistics = () => {
    const total = queries.length;
    const pending = queries.filter(q => q.status === 'PENDING').length;
    const inProgress = queries.filter(q => q.status === 'IN_PROGRESS' || q.status === 'ASSIGNED').length;
    const resolved = queries.filter(q => q.status === 'RESOLVED' || q.status === 'CLOSED').length;

    return { total, pending, inProgress, resolved };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Query Dashboard</h1>
          <p className="text-gray-600">View and track all submitted queries</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Queries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedPriority('');
                setSelectedStatus('');
              }}
              className="ml-auto text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search queries..."
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchQueries}
                className="ml-auto text-sm text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Queries List */}
        <div className="space-y-6">
          {filteredQueries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
              <p className="text-gray-500">
                {queries.length === 0 
                  ? "No queries have been submitted yet." 
                  : "No queries match your current filters. Try adjusting your search criteria."
                }
              </p>
            </div>
          ) : (
            filteredQueries.map((query) => {
              const priorityStyle = getPriorityStyle(query.priority);
              const statusStyle = getStatusStyle(query.status);

              return (
                <div key={query.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
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
                      {getStatusIcon(query.status)}
                      <span className="ml-1">{statusStyle.label}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(query.createdAt)}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                      {query.assignedToWorker && (
                        <div>
                          <span className="font-medium text-gray-500">Assigned to:</span>
                          <span className="ml-1 text-gray-900">{query.assignedToWorker.name}</span>
                        </div>
                      )}
                      {query.resolvedAt && (
                        <div>
                          <span className="font-medium text-gray-500">Resolved:</span>
                          <span className="ml-1 text-gray-900">{formatDate(query.resolvedAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Completion Information for Resolved Queries */}
                    {query.status === 'RESOLVED' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Work Completed</h4>
                        <div className="text-xs text-gray-500 mb-2">
                          Completed by: {query.completedByUser?.name || 'Unknown'} on {formatDate(query.resolvedAt)}
                        </div>
                        {query.completionNotes && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-500 block mb-1">Completion Notes:</span>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">{query.completionNotes}</p>
                          </div>
                        )}
                        {query.completionImagePath && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 block mb-2">Completion Evidence:</span>
                            <img
                              src={`http://localhost:8080${query.completionImagePath}`}
                              alt="Completion evidence"
                              className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                              onClick={() => window.open(`http://localhost:8080${query.completionImagePath}`, '_blank')}
                              title="Click to view full image"
                            />
                          </div>
                        )}
                        {!query.completionNotes && !query.completionImagePath && (
                          <div className="text-sm text-gray-500 italic">No completion details provided.</div>
                        )}
                      </div>
                    )}
                    
                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Admin Actions:</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedQuery(query);
                                setShowAssignModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Assign Worker
                            </button>
                            <button
                              onClick={() => deleteQuery(query.id)}
                              className="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchQueries}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queries
          </button>
        </div>
      </div>

      {/* Assign Worker Modal */}
      {showAssignModal && selectedQuery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Assign Worker to Query #{selectedQuery.id}
                </h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedQuery(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Category:</strong> {selectedQuery.category}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Title:</strong> {selectedQuery.title}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available {selectedQuery.category} Workers:
                </label>
                <div className="space-y-2">
                  {getFilteredWorkers(selectedQuery.category).length > 0 ? (
                    getFilteredWorkers(selectedQuery.category).map((worker) => (
                      <button
                        key={worker.id}
                        onClick={() => assignWorker(selectedQuery.id, worker.id)}
                        className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{worker.name}</div>
                        <div className="text-sm text-gray-600">{worker.email}</div>
                        <div className="text-xs text-blue-600">{worker.workerType}</div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No {selectedQuery.category.toLowerCase()} workers available
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedQuery(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
