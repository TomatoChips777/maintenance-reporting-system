import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Table, Accordion, Spinner } from 'react-bootstrap';
import axios from 'axios';
import FormatDate from '../../extra/DateFormat';
import { io } from 'socket.io-client';
import Charts from './components/Charts';
import { useAuth } from '../../../AuthContext';

import DashboardInventoryCard from './components/DashboardInventoryCard';
const Dashboard = () => {
  const { user } = useAuth();
  const [inventoryData, setInventoryData] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [reports, setReports] = useState([]);
  const [quickStats, setQuickStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reportsToday, setReportsToday] = useState([]);
  const [inProgressReports, setInProgressReports] = useState([]);
  const [recentlyCompletedReports, setRecentlyCompletedReports] = useState([]);

  const fetchData = async () => {
    axios.get(`${import.meta.env.VITE_DASHBOARD_DATA}/${user.id}`)
      .then(res => {
        setInventoryData(res.data.inventory || []);
        setUpcomingEvents(res.data.upcomingEvents || []);
        setOngoingEvents(res.data.ongoingEvents || []);
        setReports(res.data.reportFrequencyResult || []);
        setQuickStats(res.data.quickStats || []);
        setReportsToday(res.data.reportsTodayList)
        setInProgressReports(res.data.inProgressList || []);
        setRecentlyCompletedReports(res.data.recentlyCompletedList || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchData();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('update', () => {
      fetchData();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-end align-items-center mb-3">
      </div>
        <p className='text-center'><strong>Under Development...</strong></p>     
    </div>
  );
};

export default Dashboard;
