import React, { useState, useEffect } from 'react';
import { Navbar, Button, Dropdown, Badge, Image, Modal, Row, Col, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../../../AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import TextTruncate from '../../extra/TextTruncate';
import FormatDate from '../../extra/DateFormat';
import { PersonCircle } from 'react-bootstrap-icons';

function TopNavbar({ toggleSidebar }) {
  const { user, signOut } = useAuth();

  const [dateTime, setDateTime] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setDateTime(now);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_NOTIFICATIONS}/${user.id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateNotifications', fetchNotifications);
    return () => socket.disconnect();
  }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const getTimeAgo = (timestamp) => {
    const units = [
      { name: 'year', seconds: 31536000 },
      { name: 'month', seconds: 2592000 },
      { name: 'day', seconds: 86400 },
      { name: 'hr', seconds: 3600 },
      { name: 'min', seconds: 60 },
      { name: 'sec', seconds: 1 },
    ];
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    for (let unit of units) {
      const value = Math.floor(diff / unit.seconds);
      if (value > 0) return `${value} ${unit.name}${value > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${import.meta.env.VITE_GET_NOTIFICATIONS}/${user.id}/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setShowModal(false);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="sticky-navbar px-3">
        <Container fluid>
          {/* Left side */}
          <div className="d-flex align-items-center">
            <Button variant="outline-secondary" onClick={toggleSidebar} className="me-2">
              ☰
            </Button>
            <Navbar.Brand className="fw-bold">Report Management</Navbar.Brand>
          </div>
          <Navbar.Toggle
            aria-controls="top-navbar-nav"
            as={Button}
            variant="outline-secondary"
            className="me-2 p-2"
          >
            ☰
          </Navbar.Toggle>

          <Navbar.Collapse id="top-navbar-nav">
            <Nav className="ms-auto align-items-lg-center">
              <span className="fw-semibold text-secondary position-absolute start-50 translate-middle-x text-center d-none d-lg-block">
                {dateTime}
              </span>

              {/* Notifications */}
              <Dropdown as={Nav.Item} align="end" className="me-3">
                <Dropdown.Toggle as={Nav.Link} className="position-relative">
                  <i className="bi bi-bell fs-5"></i>

                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge bg="danger" pill className="position-absolute start-99 translate-middle" style={{ top: '20%' }}>
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}

                </Dropdown.Toggle>
                <Dropdown.Menu className="notification-menu">

                  <Dropdown.ItemText>
                    You have {notifications.filter(n => !n.read).length} unread notifications
                  </Dropdown.ItemText>

                  <Dropdown.Divider />
                  {notifications.map((notification, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <TextTruncate text={notification.message} maxLength={40} />
                      <div className="text-muted small">{getTimeAgo(notification.created_at)}</div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {/* User */}
              <Dropdown as={Nav.Item} align="end">
                <Dropdown.Toggle as={Nav.Link} className="d-flex align-items-center">
                  {user.image_url ? (
                    <Image
                      src={`${import.meta.env.VITE_IMAGES}/${user.image_url}`}
                      roundedCircle
                      className="me-2"
                      width={30}
                      height={30}
                      alt="User"
                    />
                  ) : (
                    <PersonCircle className="me-2" size={30}/>
                  )}
                  <span className="d-none d-md-inline">
                    {user.name || user.email || ''}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Profile</Dropdown.Item>
                  <Dropdown.Item href="#">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={signOut}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>



      {/* Notification Modal */}
      {selectedNotification && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Notification Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedNotification.title === 'Events' ? (() => {
              const message = selectedNotification.message;
              const hasOngoing = message.includes('Ongoing Events');
              const hasUpcoming = message.includes('Upcoming Events');

              const ongoingText = hasOngoing
                ? message.split('Upcoming Events')[0].replace('Ongoing Events', '').trim()
                : '';

              const upcomingText = hasUpcoming
                ? message.split('Upcoming Events')[1].trim()
                : '';

              return (
                <Row>
                  {hasOngoing && (
                    <Col>
                      <h6>Ongoing</h6>
                      <pre style={{ whiteSpace: 'pre-wrap' }}>{ongoingText}</pre>
                    </Col>
                  )}
                  {hasUpcoming && (
                    <Col>
                      <h6>Upcoming</h6>
                      <pre style={{ whiteSpace: 'pre-wrap' }}>{upcomingText}</pre>
                    </Col>
                  )}
                </Row> 
              );
            })() : (
              <Row>
                <Col>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedNotification.message}
                  </pre>
                </Col>
              </Row>
            )} 
            <small className="text-muted d-block mt-3">
              {FormatDate(selectedNotification.created_at)}
            </small>
          </Modal.Body>
          <Modal.Footer className="bg-light border-0">
            {!selectedNotification.read && (
              <Button variant="primary" size="sm" onClick={() => markAsRead(selectedNotification.id)}>
                Mark as Read
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default TopNavbar;
