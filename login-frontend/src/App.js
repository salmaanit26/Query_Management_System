import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import QueryForm from "./components/QueryForm";
import SimpleQueryForm from "./components/SimpleQueryForm";
import WorkerDashboard from "./components/WorkerDashboard";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="worker-dashboard" element={<WorkerDashboard />} />
              <Route path="query-form" element={<QueryForm />} />
              <Route path="profile" element={<div>Profile Page - Coming Soon</div>} />
              <Route path="new-query" element={<SimpleQueryForm />} />
              <Route path="venues" element={<div>Venues Page - Coming Soon</div>} />
              <Route path="users" element={<div>Users Page - Coming Soon</div>} />
              <Route path="analytics" element={<div>Analytics Page - Coming Soon</div>} />
              <Route path="settings" element={<div>Settings Page - Coming Soon</div>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
