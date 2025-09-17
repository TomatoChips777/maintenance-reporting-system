import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Table, Accordion, Spinner } from 'react-bootstrap';
import axios from 'axios';
import FormatDate from '../../extra/DateFormat';
import { io } from 'socket.io-client';
import Charts from './components/Charts';
import { useAuth } from '../../../AuthContext';
import DashboardInventoryCard from './components/DashboardInventoryCard';
const Dashboard = () => {
  const { user } = useAuth(); // Reference to current user
  const [reports, setReports] = useState([]); // holds reports data
  const [quickStats, setQuickStats] = useState([]); // holds quick stats data
  const [loading, setLoading] = useState(true); // loading flag
  const [categoryData, setCategoryData] = useState([]); // holds category data 
  const [reportsToday, setReportsToday] = useState([]); // holds reports today lists
  const [inProgressReports, setInProgressReports] = useState([]); // holds reports with a status of in-progress
  const [recentlyCompletedReports, setRecentlyCompletedReports] = useState([]); // reports with completed status
  const [avgData, setAvgData] = useState([]);

  
  // Fetch Data function
  const fetchData = async () => {
    axios.get(`${import.meta.env.VITE_DASHBOARD_DATA}/${user.id}`)
      .then(res => {
        setReports(res.data.reportFrequencyResult || []); 
        setQuickStats(res.data.quickStats || []);
        setReportsToday(res.data.reportsTodayList)
        setInProgressReports(res.data.inProgressList || []);
        setRecentlyCompletedReports(res.data.recentlyCompletedList || []);
        setCategoryData(res.data.categoryData || []);
        setAvgData(res.data.trends);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }

  // For dynamic update to the page
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
      <Card className="mb-4">
        <Card.Body>

          {/* Quick stats Overview */}
          <Row className="g-3">
            {[
              { label: "In Progress Reports", value: quickStats.inProgessCount},
              { label: "Urgent Task", value: quickStats.urgentReports},
              { label: "High Priority Task", value: quickStats.highPriorityReports },
              { label: "Medium Priority Task", value: quickStats.mediumPriorityReports},
            ].map(({ label, value, variant }, index) => (
              <Col key={index} xs={12} sm={6} md={2} className="flex-grow-1">
                <Card  text="white" className="h-100 shadow-sm bg-quick-stats">
                  <Card.Body className="text-center">
                    <Card.Title className="fs-2">{value}</Card.Title>
                    <Card.Text>{label}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
      <Row className="mb-4">

        {/* Reports Frequency & Reports Summary Overview */}
        <Col md={6}>
          <Row className="mb-4">
            <Col>
              <Card className="mb-3">
                <Card.Header className="fw-semibold d-flex justify-content-between">Reports Frequency
                </Card.Header>
                <Card.Body>
                  <Charts type="reportsFrequency" data={reports} />
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header className="fw-semibold d-flex justify-content-between">
                  Reports Summary
                </Card.Header>
                <Card.Body> 
                  <Charts type="reportStatus" data={categoryData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>


           <Row className="mb-4">
            <Col>
              <Card className="mb-3">
                <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
                  Borrowers Frequency
                </Card.Header>
                <Card.Body>
                  <Charts type="borrowerRanking" data={null} />
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
                  Assist Frequencys
                </Card.Header>
                <Card.Body>
                  <Charts type="assistFrequency" data={null} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={6}>
          {/* Today's Events */}
          <Card className='mb-4'>
            <Card.Header className="fw-semibold d-flex justify-content-between">
              Recent Reports
            </Card.Header>
            <Card.Body>
              {reportsToday.length === 0 ? (
                <p>No task reported for today</p>
              ) : (
                <Accordion flush>
                  {reportsToday.map((report, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={idx}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between">
                          <span>{report.location}</span>
                          <span>{FormatDate(report.created_at, 'short')} | {report.time}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <strong>Description:</strong>
                        <ul className="mb-0">
                          <li>{report.description}</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>
            {/* In Progress Reports */}
          <Card className='mb-4'>
            <Card.Header className="fw-semibold d-flex justify-content-between">
              In Progress Reports
            </Card.Header>
            <Card.Body>
              {inProgressReports.length === 0 ? (
                <p>No reports in progress</p>
              ) : (
                <Accordion flush>
                  {inProgressReports.map((report, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={report.id}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between">
                          <span>{report.location}</span>
                          <span>{FormatDate(report.updated_at, 'short')} | {report.time}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <strong>Priority:</strong> {report.priority} <br />
                        <strong>Description:</strong>
                        <ul className="mb-0">
                          <li>{report.description}</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>

            {/* Recently Completed Reports  */}
          <Card className='mb-4'>
            <Card.Header className="fw-semibold d-flex justify-content-between">
              Recently Completed Reports
            </Card.Header>
            <Card.Body>
              {recentlyCompletedReports.length === 0 ? (
                <p>No reports completed recently</p>
              ) : (
                <Accordion flush>
                  {recentlyCompletedReports.map((report, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={report.id}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between">
                          <span>{report.location}</span>
                          <span>{FormatDate(report.updated_at, 'short')}  | {report.time}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <strong>Priority:</strong> {report.priority} <br />
                        <strong>Description:</strong>
                        <ul className="mb-0">
                          <li>{report.description}</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>

            {/* <Charts type="resolutionTrends" data={avgData} /> */}

          </Card>
          {/* <DashboardInventoryCard inventoryData={inventoryData} /> */}
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
