// App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import LoginScreen from './LoginScreen';
import { useAuth } from '../AuthContext';
import LandingPage from './LandingPage';
import UserDashboard from './Users/UserDashboard';
import MaintenanceApp from './Maintenance/MaintenanceApp';
import ReportManagerApp from './Report Manager/ReportManagerApp';
import LostAndFoundApp from './Lost & Found/LostAndFoundApp';
function App() {
  const { isAuthenticated, isLoading, role } = useAuth();
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {isAuthenticated && role === 'Admin' ? (
        <MaintenanceApp />
      ) : isAuthenticated && role == 'Report Manager' ? (
        <ReportManagerApp />
      ) : isAuthenticated && role == 'User' ? (
        <UserDashboard />
      ) : isAuthenticated && role == 'Lost & Found Manager' ? (

        <LostAndFoundApp />

      ) : (
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
}
export default App;
