import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  User, 
  PlusCircle, 
  Building, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Users,
  BarChart3,
  Wrench
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin, isWorker } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, show: true },
    { name: 'Worker Dashboard', href: '/worker-dashboard', icon: Wrench, show: isWorker },
    { name: 'Profile', href: '/profile', icon: User, show: true },
    { name: 'New Query', href: '/new-query', icon: PlusCircle, show: true },
    { name: 'All Venues', href: '/venues', icon: Building, show: true },
    { name: 'Manage Users', href: '/users', icon: Users, show: isAdmin },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, show: isAdmin },
    { name: 'Settings', href: '/settings', icon: Settings, show: isAdmin },
  ];

  const filteredNavigation = navigation.filter(item => item.show);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <SidebarContent 
            user={user} 
            navigation={filteredNavigation} 
            currentPath={location.pathname}
            onLogout={handleLogout}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:w-64 lg:flex lg:flex-col">
        <SidebarContent 
          user={user} 
          navigation={filteredNavigation} 
          currentPath={location.pathname}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Compliance Query Management System
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ user, navigation, currentPath, onLogout, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">CQMS</h2>
            <p className="text-xs text-gray-500">Compliance System</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
              user?.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
              user?.role === 'WORKER' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {user?.role}
              {user?.workerType && ` - ${user.workerType}`}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Layout;
