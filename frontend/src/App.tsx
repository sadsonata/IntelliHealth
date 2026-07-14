import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ExerciseLibrary } from './pages/ExerciseLibrary';
import { WorkoutPlanPage } from './pages/WorkoutPlan';
import { Settings } from './pages/Settings';
import { AppLayout } from './layouts/AppLayout';

function App() {
  // Simple authentication state - in a real app, this would come from auth context/localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously logged in (for demo purposes)
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    // Listen for login events (for demo purposes)
    const handleLogin = () => {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
    };

    // For demo purposes, we'll use a custom event
    window.addEventListener('login', handleLogin);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            isAuthenticated ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          <Route path="/exercise-library" element={
            isAuthenticated ? (
              <AppLayout>
                <ExerciseLibrary />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          <Route path="/workout-plan" element={
            isAuthenticated ? (
              <AppLayout>
                <WorkoutPlanPage />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          <Route path="/settings" element={
            isAuthenticated ? (
              <AppLayout>
                <Settings />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
