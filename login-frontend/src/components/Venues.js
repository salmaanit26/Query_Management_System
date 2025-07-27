import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  Building, 
  Hash, 
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { venuesAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Venues = () => {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CLASSROOM',
    capacity: '',
    location: '',
    building: '',
    floor: '',
    amenities: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const venueTypes = ['ALL', 'CLASSROOM', 'LAB', 'HALL', 'OFFICE', 'LIBRARY', 'HOSTEL', 'OTHER'];
  const availableVenueTypes = ['CLASSROOM', 'LAB', 'HALL', 'OFFICE', 'LIBRARY', 'HOSTEL', 'OTHER'];

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await venuesAPI.getAllVenues();
      setVenues(response.data);
    } catch (err) {
      setError('Failed to fetch venues');
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.building?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || venue.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getVenueIcon = (type) => {
    switch(type) {
      case 'CLASSROOM': return '📚';
      case 'LAB': return '🔬';
      case 'HALL': return '🏛️';
      case 'OFFICE': return '🏢';
      case 'LIBRARY': return '📖';
      case 'HOSTEL': return '🏠';
      default: return '🏢';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'CLASSROOM': return 'bg-blue-100 text-blue-800';
      case 'LAB': return 'bg-green-100 text-green-800';
      case 'HALL': return 'bg-purple-100 text-purple-800';
      case 'OFFICE': return 'bg-orange-100 text-orange-800';
      case 'LIBRARY': return 'bg-indigo-100 text-indigo-800';
      case 'HOSTEL': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'CLASSROOM',
      capacity: '',
      location: '',
      building: '',
      floor: '',
      amenities: '',
      description: ''
    });
    setFormErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setModalMode('add');
    setEditingVenue(null);
    setIsModalOpen(true);
  };

  const openEditModal = (venue) => {
    setFormData({
      name: venue.name || '',
      type: venue.type || 'CLASSROOM',
      capacity: venue.capacity ? venue.capacity.toString() : '',
      location: venue.location || '',
      building: venue.building || '',
      floor: venue.floor ? venue.floor.toString() : '',
      amenities: venue.amenities || '',
      description: venue.description || ''
    });
    setFormErrors({});
    setModalMode('edit');
    setEditingVenue(venue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVenue(null);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Venue name is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!formData.type) {
      errors.type = 'Venue type is required';
    }
    
    if (formData.capacity && (isNaN(formData.capacity) || parseInt(formData.capacity) < 1)) {
      errors.capacity = 'Capacity must be a positive number';
    }
    
    if (formData.floor && (isNaN(formData.floor) || parseInt(formData.floor) < 0)) {
      errors.floor = 'Floor must be a non-negative number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        floor: formData.floor ? parseInt(formData.floor) : null
      };

      console.log('Submitting venue data:', submitData);
      console.log('Mode:', modalMode);
      console.log('Editing venue ID:', editingVenue?.id);

      if (modalMode === 'add') {
        const response = await venuesAPI.createVenue(submitData);
        console.log('Add venue response:', response.data);
      } else {
        const response = await venuesAPI.updateVenue(editingVenue.id, submitData);
        console.log('Update venue response:', response.data);
      }
      
      await fetchVenues();
      closeModal();
    } catch (err) {
      console.error('Error saving venue:', err);
      console.error('Error response:', err.response?.data);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to ${modalMode} venue`);
      }
    }
  };

  const handleDelete = async (venueId) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) {
      return;
    }

    try {
      await venuesAPI.deleteVenue(venueId);
      await fetchVenues();
    } catch (err) {
      console.error('Error deleting venue:', err);
      setError('Failed to delete venue');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={fetchVenues}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Venues</h1>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Manage campus venues and facilities</p>
          </div>
          {isAdmin && (
            <button 
              onClick={openAddModal}
              className={`px-4 py-2 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg flex items-center gap-2`}
            >
              <Plus size={20} />
              Add Venue
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
            <input
              type="text"
              placeholder="Search venues by name, location, or building..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {venueTypes.map(type => (
              <option key={type} value={type}>
                {type === 'ALL' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Venues</p>
                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{venues.length}</p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Capacity</p>
                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {venues.reduce((sum, venue) => sum + (venue.capacity || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Hash className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Buildings</p>
                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {new Set(venues.map(v => v.building).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Avg Capacity</p>
                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {venues.length > 0 ? Math.round(venues.reduce((sum, venue) => sum + (venue.capacity || 0), 0) / venues.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>🏢</div>
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No venues found</h3>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {venues.length === 0 
              ? "No venues have been added yet." 
              : "No venues match your current search criteria."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div key={venue.id} className={`rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{getVenueIcon(venue.type)}</div>
                    <div>
                      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{venue.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(venue.type)}`}>
                        {venue.type}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openEditModal(venue)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit venue"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(venue.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete venue"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <MapPin size={14} className={`mr-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    {venue.location}
                  </div>
                  {venue.building && (
                    <div className="flex items-center">
                      <Building size={14} className={`mr-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      {venue.building}
                      {venue.floor && `, Floor ${venue.floor}`}
                    </div>
                  )}
                  {venue.capacity && (
                    <div className="flex items-center">
                      <Users size={14} className={`mr-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      Capacity: {venue.capacity}
                    </div>
                  )}
                  {venue.amenities && (
                    <div className="mt-3">
                      <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Amenities:</p>
                      <p className="text-sm">{venue.amenities}</p>
                    </div>
                  )}
                  {venue.description && (
                    <div className="mt-3">
                      <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description:</p>
                      <p className="text-sm">{venue.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit Venue */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`flex justify-between items-center p-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {modalMode === 'add' ? 'Add New Venue' : 'Edit Venue'}
              </h2>
              <button 
                onClick={closeModal}
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Name Field */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Venue Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.name 
                      ? 'border-red-500' 
                      : theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter venue name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Type Field */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Venue Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.type 
                      ? 'border-red-500' 
                      : theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  {availableVenueTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {formErrors.type && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>
                )}
              </div>

              {/* Location Field */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.location 
                      ? 'border-red-500' 
                      : theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter venue location"
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
                )}
              </div>

              {/* Building Field */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Building
                </label>
                <input
                  type="text"
                  name="building"
                  value={formData.building}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter building name"
                />
              </div>

              {/* Floor and Capacity */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Floor
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.floor 
                        ? 'border-red-500' 
                        : theme === 'dark' 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {formErrors.floor && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.floor}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.capacity 
                        ? 'border-red-500' 
                        : theme === 'dark' 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="50"
                    min="1"
                  />
                  {formErrors.capacity && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.capacity}</p>
                  )}
                </div>
              </div>

              {/* Amenities Field */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Amenities
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Projector, AC, WiFi, etc."
                />
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Additional details about the venue..."
                />
              </div>

              {/* Action Buttons */}
              <div className={`flex justify-end space-x-3 pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg ${
                    theme === 'dark' 
                      ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={16} />
                  {modalMode === 'add' ? 'Add Venue' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venues;
