import { Container, Card, Button, Row, Col, ListGroup, Badge, Alert } from "react-bootstrap";
import FormatDate from "../extra/DateFormat";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";


function ViewReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState([]);
  const { reportId, user } = location.state || {}; // get passed data
  const [progressLog, setProgressLog] = useState([]);
  
  console.log(reportId);
  const fetchReport = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VIEW_REPORT_BY_ID}/${reportId}`);
      // setReport(response.data.reports);
      setReport(response.data.reports);
      console.log(response.data.reports);
      console.log(report)
    } catch (err) {
    }
  }

  const currentStatus = report?.status || "Pending";
  // current status flow
  const statusSteps = ["Pending", "Acknowledged", "In Progress", "Resolved"];

  let currentProgessStatus = "Pending";

  if (report?.acknowledged_by) {
    currentProgessStatus = "Acknowledged";
  }
  if (report?.status === "In Progress") {
    currentProgessStatus = "In Progress";
  }
  if (report?.status === "Resolved") {
    currentProgessStatus = "Resolved";
  }

  const fetchRemarks = async () => {
    if (!report?.id) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_GET_REPORT_REMARKS}/${report?.id}`
      );
      setProgressLog(res.data.remarks);
    } catch (err) {
      console.error("Failed to fetch remarks:", err);
    }
  };

  // fetch remarks/logs
  useEffect(() => {
    fetchReport();
    fetchRemarks();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateViewedReport', () => {
      fetchRemarks();
      fetchReport();
    });

    return () => {
      socket.disconnect();
    };

  }, [reportId]);

  if (!reportId) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Card className="p-4 shadow-sm text-center" style={{ maxWidth: "500px", width: "100%" }}>
          <h4 className="mb-3">No Report Found</h4>
          <p className="text-muted mb-4">
            The report you are trying to view does not exist or may have been removed.
          </p>
          <Button variant="secondary" onClick={() => navigate("/user/my-reports")}>

            <i className="bi bi-arrow-left me-2"></i> Back to Reports
          </Button>
        </Card>
      </Container>
    );
  }

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
            <p><strong>Category:</strong> {report?.category}</p>
            <p>
              <strong>Priority:</strong>
              <Badge
                bg={
                  report?.priority === "High"
                    ? "danger"
                    : report?.priority === "Medium"
                      ? "warning"
                      : "secondary"
                }
                className="ms-2"
              >
                {report?.priority}
              </Badge>
            </p>
            <p>
              <strong>Status:</strong>
              <Badge
                bg={
                  currentStatus === "Pending"
                    ? "warning"
                    : currentStatus === "Acknowledged"
                      ? "info"
                      : currentStatus === "In Progress"
                        ? "primary"
                        : "success"
                }
                className="ms-2"
              >
                {currentStatus}
              </Badge>
            </p>
          </Col>
          <Col md={6}>
            <p><strong>Location:</strong> {report?.location}</p>
            <p><strong>Date Reported:</strong> {FormatDate(report?.created_at)}</p>
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
              const stepCompleted = statusSteps.indexOf(currentProgessStatus) >= index;
              return (
                <div key={index} className="text-center flex-fill">
                  <div
                    className={`rounded-circle mx-auto mb-2 ${stepCompleted ? "bg-success" : "bg-light"
                      }`}
                    style={{
                      width: "40px",
                      height: "40px",
                      lineHeight: "40px",
                      color: "white",
                    }}
                  >
                    {index + 1}
                  </div>
                  <small
                    className={
                      stepCompleted ? "fw-bold text-success" : "text-muted"
                    }
                  >
                    {step}
                  </small>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Log */}
        {/* <div className="mb-4">
          <h5>Progress Log</h5>
          <ListGroup>
            {progressLog.length > 0 ? (
              progressLog.map((log, idx) => (
                <ListGroup.Item key={log.id || idx}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{log.action}</strong> <br />
                      <p>{log.remark}</p>
                      <small>By {log.by || log.updated_by}</small>
                    </div>
                    <small>{FormatDate(log.date || log.created_at)}</small>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No logs yet.</ListGroup.Item>
            )}
          </ListGroup>
        </div> */}

        {/* Progress Log */}
        <div className="mb-4">
          <h5>Progress Log</h5>
          <ListGroup>
            {progressLog.length > 0 ? (
              progressLog.map((log, idx) => (
                <ListGroup.Item key={log.id || idx}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong className="d-block">{log.action}</strong>
                      {log.remark && (
                        <small className="text-muted d-block">{log.remark}</small>
                      )}
                      <small className="text-secondary">
                        By {log.by || log.updated_by}
                      </small>
                    </div>
                    <small className="text-muted">
                      {FormatDate(log.date || log.created_at)}
                    </small>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No logs yet.</ListGroup.Item>
            )}
          </ListGroup>
        </div>

      </Card>
    </Container>
  );
}

export default ViewReportPage;

