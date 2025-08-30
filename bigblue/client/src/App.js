// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Components
import Navbar from './components/Common/Navbar';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import LocationPage from './pages/LocationPage';
import BuddyBoardPage from './pages/BuddyBoardPage';
import DiveLogPage from './pages/DiveLogPage';
import BuddyFinderPage from './pages/BuddyFinderPage';
import ProfilePage from './pages/ProfilePage';
import DiveSitesListPage from './pages/DiveSitesListPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Styles - Remove if you don't have App.css
// import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router basename="/BigBlue">
        <div className="min-h-screen bg-light-gray">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/dive-sites" element={<DiveSitesListPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/locations/:id" element={<LocationPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/buddy-board" element={
              <ProtectedRoute>
                <BuddyBoardPage />
              </ProtectedRoute>
            } />
            <Route path="/dive-logs" element={
              <ProtectedRoute>
                <DiveLogPage />
              </ProtectedRoute>
            } />
            <Route path="/buddy-finder" element={
              <ProtectedRoute>
                <BuddyFinderPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Redirect any unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;