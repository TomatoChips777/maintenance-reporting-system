// App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginScreen from './LoginScreen';
import { useAuth } from '../AuthContext';
import UserDashboard from './Users/UserDashboard';
import MaintenanceApp from './Maintenance/MaintenanceApp';
import ReportsApproverApp from './Reports Approver/ReportsApproverApp';
function App() {
  const { isAuthenticated, isLoading, role } = useAuth();
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {isAuthenticated && role === 'Admin' ? (
        <MaintenanceApp />
      ) : isAuthenticated && role == 'User' ? (
        <UserDashboard />
      ) : isAuthenticated && role =='Report Approver' ? (
        <ReportsApproverApp />
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
