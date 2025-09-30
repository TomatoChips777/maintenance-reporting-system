
import { Container, Card, Button, Row, Col, ListGroup, Badge } from "react-bootstrap";
import FormatDate from "../extra/DateFormat";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function ViewReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState([]);
  const { reportId } = location.state || {};
  const [progressLog, setProgressLog] = useState([]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VIEW_REPORT_BY_ID}/${reportId}`);
      setReport(response.data.reports[0]);
    } catch (err) {
      console.error("Failed to fetch remarks:", err);
    }
  };

  const currentStatus = report?.status || "Pending";
  const statusSteps = ["Pending", "Acknowledged", "In Progress", "Resolved"];

  let currentProgessStatus = "Pending";
  if (report?.acknowledged_by) currentProgessStatus = "Acknowledged";
  if (report?.status === "In Progress") currentProgessStatus = "In Progress";
  if (report?.status === "Resolved") currentProgessStatus = "Resolved";

  const fetchRemarks = async () => {
    if (!reportId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_GET_REPORT_REMARKS}/${reportId}`);
      setProgressLog(res.data.remarks);
    } catch (err) {
      console.error("Failed to fetch remarks:", err);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchRemarks();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on("updateViewedReport", () => {
      fetchRemarks();
      fetchReport();
    });
    return () => socket.disconnect();
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

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
          <h4 className="mb-2 mb-md-0">View Report</h4>
          <Button variant="secondary" size="sm" onClick={() => navigate("/user/my-reports")}>
            <i className="bi bi-arrow-left me-2"></i> Back to Reports
          </Button>
        </div>

        {/* Report Details */}
        <Row>
          <Col xs={12} md={6} className="mb-3 mb-md-0">

            <p>
              <strong>Category:</strong>{" "}
              <span className="text-decoration-underline">{report?.category}</span>
            </p>

            <p>
              <strong>Priority:</strong>{" "}
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
              <strong>Status:</strong>{" "}
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

          <Col xs={12} md={6}>
            <p>
              <strong>Location:</strong>{" "}
              <span className="text-decoration-underline">{report?.location}</span>
            </p>
            <p>
              <strong>Date Reported:</strong>{" "}
              <span className="text-decoration-underline">{FormatDate(report?.created_at)}</span>
            </p>
          </Col>
        </Row>

        {/* Description */}
        <div className="mb-4">
          <h5>Description</h5>
          <Card className="p-3">
            {report?.description ? (
              <div
                dangerouslySetInnerHTML={{ __html: report.description }}
                style={{ wordBreak: "break-word" }}
              />
            ) : (
              <p className="mb-0 text-muted">No description provided.</p>
            )}
          </Card>
        </div>

        {/* Status Tracker */}
        <div className="mb-4">
          <h5>Status Progress</h5>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            {statusSteps.map((step, index) => {
              const stepCompleted = statusSteps.indexOf(currentProgessStatus) >= index;
              return (
                <div key={index} className="text-center flex-fill mb-3">
                  <div
                    className={`rounded-circle mx-auto mb-2 ${stepCompleted ? "bg-success" : "bg-light"}`}
                    style={{
                      width: "40px",
                      height: "40px",
                      lineHeight: "40px",
                      color: "white",
                    }}
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
            {progressLog.length > 0 ? (
              progressLog.map((log, idx) => (
                <ListGroup.Item key={log.id || idx}>
                  <div className="d-flex flex-column flex-sm-row justify-content-between">
                    <div>
                      <strong className="d-block">{log.action}</strong>
                      {log.remark && <small className="text-muted d-block">{log.remark}</small>}
                      <small className="text-secondary">By {log.by || log.updated_by}</small>
                    </div>
                    <small className="mt-2 mt-sm-0 text-muted">
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

  )
}

export default ViewReportPage;
