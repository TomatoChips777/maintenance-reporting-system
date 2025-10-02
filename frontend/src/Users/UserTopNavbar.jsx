// Users/UserTopNavbar.jsx
import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Dropdown,
  Badge,
  Image,
  Container,
  Button,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { PersonCircle } from "react-bootstrap-icons";
import axios from "axios";
import { io } from "socket.io-client";
import TextTruncate from "../extra/TextTruncate";
import FormatDate from "../extra/DateFormat";

function UserTopNavbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [activeLink, setActiveLink] = useState("Report");

  // Sync active link with current route
  useEffect(() => {
    if (location.pathname.includes("my-reports") || location.pathname.includes('view-report')) {
      setActiveLink("My Reports");
    } else if (location.pathname.includes("notifications")) {
      setActiveLink("Notifications");
    } else {
      setActiveLink("Report");
    }
  }, [location.pathname]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_GET_NOTIFICATIONS}/${user.id}`
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on("updateNotifications", () => {
      fetchNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle navigation
  const handleNavClick = (key) => {
    setActiveLink(key);

    const routeMap = {
      Report: "/user/report",
      "My Reports": "/user/my-reports",
      Notifications: "/user/notifications",
    };
    navigate(routeMap[key]);
  };

  return (
    <Navbar
      bg="success"
      variant="dark"
      expand="xl"
      sticky="top"
      className="px-3"
    >
      <Container fluid>
        {/* Brand on the left */}
        <Navbar.Brand
          // href="#"
          onClick={() => handleNavClick("Report")}
          className="fw-bold fs-5 fs-md-4 fs-lg-3"
        >
        Ticketing
        </Navbar.Brand>

        {/* Toggle button on the right */}
        {/* Toggle button with notification count (small screens only) */}
        <div className="position-relative d-lg-none">
          <Navbar.Toggle aria-controls="top-navbar-nav"
            as={Button}
            variant="outline-dark"
            className="me-2 p-2"
          >

          </Navbar.Toggle>
          {notifications.filter(n => !n.read).length > 0 && (
            <Badge
              bg="danger"
              pill
              className="position-absolute top-0 start-100 translate-middle"
            >
              {notifications.filter(n => !n.read).length}
            </Badge>
          )}
        </div>

        {/* Collapsible section */}
        <Navbar.Collapse id="user-navbar-nav">
          <Nav className="me-auto">
            {["Report", "My Reports"].map((key) => (
              <Nav.Link
                key={key}
                onClick={() => handleNavClick(key)}
                className={
                  activeLink === key ? "fw-bold text-light" : "text-white"
                }
              >
                {key}
              </Nav.Link>
            ))}
          </Nav>

          {/* Right-side content */}
          <Nav className="ms-auto">
            {/* Notifications Dropdown */}
            <Dropdown
              align="end"
              className="me-3"
              as={Nav.Item}
            >
              <Dropdown.Toggle
                as={Nav.Link}
                variant="success"
                className={`position-relative border-0 ${activeLink === "Notifications" ? "fw-bold text-light" : "text-white"
                  }`}
                onClick={() => handleNavClick("Notifications")}
              >
                {activeLink === "Notifications" ? (
                  <i className="bi bi-bell-fill fs-5"></i>
                ) : (
                  <i className="bi bi-bell fs-5"></i>
                )}
                {notifications.length > 0 && (
                  <Badge bg="danger" pill className="position-absolute start-99 translate-middle" style={{ top: '20%' }}>
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end">
                <Dropdown.ItemText>
                  You have {notifications.length} notifications
                </Dropdown.ItemText>
                <Dropdown.Divider />
                {notifications.map((n, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => handleNavClick("Notifications")}
                  >
                    <TextTruncate text={n.message} maxLength={40} />
                    <div className="text-muted small">
                      {FormatDate(n.created_at)}
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile Dropdown */}
            <Dropdown align="end" as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                variant="success"
                className="d-flex align-items-center border-0"
              >
                {user?.image_url ? (
                  <Image
                    src={`${import.meta.env.VITE_IMAGES}/${user.image_url}`}
                    roundedCircle
                    className="me-2"
                    width={30}
                    height={30}
                    alt="User"
                  />
                ) : (
                  <PersonCircle className="me-2" size={30} />
                )}
                <span className="d-none d-md-inline">
                  {user?.name || user?.email || "User"}
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
  );
}

export default UserTopNavbar;
