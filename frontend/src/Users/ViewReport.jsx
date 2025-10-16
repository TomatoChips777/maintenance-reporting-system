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
      console.error("Failed to fetch report:", err);
    }
  };

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

  const currentStatus = report?.status || "Pending";
  const statusSteps = ["Pending", "Acknowledged", "In Progress", "Resolved"];

  let currentProgress = "Pending";
  if (report?.acknowledged_by) currentProgress = "Acknowledged";
  if (report?.status === "In Progress") currentProgress = "In Progress";
  if (report?.status === "Resolved") currentProgress = "Resolved";

  if (!reportId) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Card className="p-3 text-center" style={{ maxWidth: "450px", width: "100%" }}>
          <h6 className="mb-2">No Report Found</h6>
          <p className="text-muted small mb-3">
            The report you are trying to view does not exist or may have been removed.
          </p>
          <Button size="sm" variant="secondary" onClick={() => navigate("/user/my-reports")}>
            <i className="bi bi-arrow-left me-1"></i> Back
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-3">
      <Card className="p-3 border-0 shadow-sm small">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0">Report Details</h6>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate("/user/my-reports")}>
            <i className="bi bi-arrow-left me-1"></i> Back
          </Button>
        </div>

        {/* Report Info */}
        <Row className="mb-3">
          <Col xs={6}>
            <p className="mb-1"><strong>Category:</strong> {report?.category || "-"}</p>
            <p className="mb-1">
              <strong>Priority:</strong>{" "}
              <Badge
                bg={
                  report?.priority === "High"
                    ? "danger"
                    : report?.priority === "Medium"
                    ? "warning"
                    : "secondary"
                }
                className="small"
              >
                {report?.priority}
              </Badge>
            </p>
            <p className="mb-1">
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
                className="small"
              >
                {currentStatus}
              </Badge>
            </p>
          </Col>
          <Col xs={6}>
            <p className="mb-1"><strong>Location:</strong> {report?.location || "-"}</p>
            <p className="mb-1"><strong>Date:</strong> {FormatDate(report?.created_at)}</p>
          </Col>
        </Row>

        {/* Description */}
        <div className="mb-3">
          <h6 className="fw-semibold">Description</h6>
          <Card className="p-2 border">
            {report?.description ? (
              <div
                dangerouslySetInnerHTML={{ __html: report.description }}
                style={{ wordBreak: "break-word", fontSize: "0.9rem" }}
              />
            ) : (
              <p className="mb-0 text-muted small">No description provided.</p>
            )}
          </Card>
        </div>

        {/* Status Tracker */}
        <div className="mb-3">
          <h6 className="fw-semibold">Progress</h6>
          <div className="d-flex justify-content-between text-center">
            {statusSteps.map((step, i) => {
              const done = statusSteps.indexOf(currentProgress) >= i;
              return (
                <div key={i} className="flex-fill">
                  <div
                    className={`rounded-circle mx-auto mb-1 ${done ? "bg-success" : "bg-light border"}`}
                    style={{
                      width: "28px",
                      height: "28px",
                      fontSize: "0.75rem",
                      lineHeight: "28px",
                      color: "#fff",
                    }}
                  >
                    {i + 1}
                  </div>
                  <small className={done ? "text-success fw-semibold" : "text-muted"}>{step}</small>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Log */}
        <div>
          <h6 className="fw-semibold">Logs</h6>
          <ListGroup className="small">
            {progressLog.length > 0 ? (
              progressLog.map((log, idx) => (
                <ListGroup.Item key={log.id || idx} className="py-2">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{log.action}</strong>
                      {log.remark && <div className="text-muted">{log.remark}</div>}
                      <small className="text-secondary">By {log.by || log.updated_by}</small>
                    </div>
                    <small className="text-muted">{FormatDate(log.date || log.created_at)}</small>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="py-2 text-muted">No logs yet.</ListGroup.Item>
            )}
          </ListGroup>
        </div>
      </Card>
    </Container>
  );
}

export default ViewReportPage;
