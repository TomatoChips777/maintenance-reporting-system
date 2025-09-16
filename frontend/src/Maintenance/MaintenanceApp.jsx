// App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Sidebar from './Navigations/Sidebar';
import TopNavbar from './Navigations/TopNavbar';
import BorrowingScreen from './Borrowing/BorrowingScreens';
import EventManager from './Events/EventManager';
import LoginScreen from '../LoginScreen';
import { useAuth } from '../../AuthContext';
import Inventory from './Inventory/Inventory';
import Dashboard from './Dashboard/Dashboard';
import Notifications from './Notifications/Notifications';
import Reports from './Reports/Reports';
import LandingPage from '../LandingPage';
import Staff from './Staff Management/Staff';
function MaintenanceApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState(() => {
    return localStorage.getItem("activeLink") || "Dashboard";
  });

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    const routeMap = {
      '/': 'Dashboard',
      '/inventory': 'Inventory',
      '/users': 'Users',
      '/borrowing': 'Borrowing',
      '/events': 'Calendar',
      '/notifications': 'Notifications',
      '/staff' : 'Staff',
      '/reports': 'Reports',

    };
    setActiveLink(routeMap[path] || 'Dashboard');

    localStorage.setItem("activeLink", activeLink);
  }, [location]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("activeLink", link);
  };
  const { isAuthenticated, isLoading, role } = useAuth();
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {isAuthenticated && role === 'Admin' ? (
        <div className="layout">
          <Sidebar
            sidebarOpen={sidebarOpen}
            activeLink={activeLink}
            handleLinkClick={handleLinkClick}
          />
          <div className="main-content">
            <TopNavbar toggleSidebar={toggleSidebar} />
            <div className="content-scroll p-3">
              <Routes>
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path='/staff' element={<Staff/>} />
                  <Route path='/reports' element={<Reports />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/borrowing" element={<BorrowingScreen />} />
                  <Route path="/events" element={<EventManager />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
}
export default MaintenanceApp;
 