import { Container, Card, Button, Row, Col, ListGroup, Badge, Alert } from "react-bootstrap";
import FormatDate from "../extra/DateFormat";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ViewReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { report, user } = location.state || {}; // get passed data

  const [progressLog, setProgressLog] = useState([
    { id: 1, action: "Report submitted", by: user?.name, date: report?.created_at },
    { id: 2, action: "Acknowledged by admin", by: "Admin User", date: "2025-09-25 10:15" },
    { id: 3, action: "Assigned to staff", by: "Admin User", date: "2025-09-25 11:00" },
    { id: 4, action: "Work started", by: "Staff A", date: "2025-09-25 09:00" },
  ]);

  // current status flow
  const statusSteps = ["Pending", "Acknowledged", "In Progress", "Resolved"];
  const currentStatus = report?.status || "Pending";

  return (
    <Container className="mt-2">

      <Card className="p-3 shadow-sm">

        {/* Header + Back Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>View Report</h4>
          <Button variant="secondary" onClick={() => navigate("/user/my-reports")}>
            <i className="bi bi-arrow-left me-2"></i> Back to Reports
          </Button>
        </div>

        {/* Report Details */}
        <Row className="mb-4">
          <Col md={6}>
            <p><strong>Reported By:</strong> {user?.name}</p>
            <p><strong>Category:</strong> {report?.category}</p>
            <p><strong>Priority:</strong>
              <Badge bg={
                report?.priority === "High" ? "danger" :
                  report?.priority === "Medium" ? "warning" : "secondary"
              } className="ms-2">
                {report?.priority}
              </Badge>
            </p>
          </Col>
          <Col md={6}>
            <p><strong>Location:</strong> {report?.location}</p>
            <p><strong>Date Reported:</strong> {FormatDate(report?.created_at)}</p>
            <p><strong>Status:</strong>
              <Badge bg={
                currentStatus === "Pending" ? "warning" :
                  currentStatus === "Acknowledged" ? "info" :
                    currentStatus === "In Progress" ? "primary" : "success"
              } className="ms-2">
                {currentStatus}
              </Badge>
            </p>
          </Col>
        </Row>

        {/* Description */}
        <div className="mb-4">
          <h5>Description</h5>
          <Card className="p-3">
            <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
              {report?.description || "No description provided."}
            </p>
          </Card>
        </div>


        {/* Status Tracker */}
        <div className="mb-4">
          <h5>Status Progress</h5>
          <div className="d-flex justify-content-between align-items-center">
            {statusSteps.map((step, index) => {
              const stepCompleted = statusSteps.indexOf(currentStatus) >= index;
              return (
                <div key={index} className="text-center flex-fill">
                  <div
                    className={`rounded-circle mx-auto mb-2 ${stepCompleted ? "bg-success" : "bg-light"}`}
                    style={{ width: "40px", height: "40px", lineHeight: "40px", color: "white" }}
                  >
                    {index + 1}
                  </div>
                  <small className={stepCompleted ? "fw-bold text-success" : "text-muted"}>
                    {step}
                  </small>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Log */}
        <div className="mb-4">
          <h5>Progress Log</h5>
          <ListGroup>
            {progressLog.map((log) => (
              <ListGroup.Item key={log.id}>
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{log.action}</strong> <br />
                    <small>By {log.by}</small>
                  </div>
                  <small>{FormatDate(log.date)}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* Notifications Section (for demo purpose) */}
        {/* <div>
          <h5>Notifications</h5>
          <Alert variant="info" className="p-2">
            <i className="bi bi-bell-fill me-2"></i>
            You will receive notifications for every update on this report.
          </Alert>
        </div> */}

      </Card>
    </Container>
  );
}

export default ViewReportPage;
