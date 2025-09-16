import { useEffect, useMemo, useState } from "react";
import { Container, Spinner, Alert, Form, Image, Row, Col, Modal } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import FormatDate from "../extra/DateFormat";
import PaginationControls from "../extra/Paginations";
import { io } from "socket.io-client";
function UserReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedReport, setExpandedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_GET_REPORTS_BY_ID}/${user?.id}`
      );
      setReports(response.data.reports);
    } catch (err) {
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReports();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateReports', () => {
      fetchReports();
    });

    return () => {
      socket.disconnect();
    };

  }, []);



  // Filter reports by search + status
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch =
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report.location.toLowerCase().includes(search.toLowerCase()) ||
        report.status.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  // Paginate filtered reports
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReports, currentPage, itemsPerPage]);

  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }

  return (
    <Container className="mt-2">
      {/* Filters */}
      <h1>My Reports</h1>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search reports"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={itemsPerPage} onChange={handlePageSizeChange}>
            <option value={4}>4 per page</option>
            <option value={8}>8 per page</option>
            <option value={12}>12 per page</option>
            <option value={16}>16 per page</option>
            <option value={20}>20 per page</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Report List */}
      {currentData.length === 0 ? (
        <Alert variant="info">No reports found.</Alert>
      ) : (

        <ul className="list-group">
          {currentData.map(report => (
            <li
              key={report.id}
              className="list-group-item p-4 mb-3 shadow-sm rounded-3 border-1 bg-white"
            >
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1 fw-bold">{report.location}</h5>
                  <small className="text-muted">
                    Reported on {FormatDate(report.created_at)}
                  </small>
                </div>
                <span
                  className={`badge px-3 py-2 fs-6 ${report.status === "Pending"
                    ? "bg-warning text-dark"
                    : report.status === "In Progress"
                      ? "bg-primary"
                      : "bg-success"
                    }`}
                >
                  {report.status}
                </span>
              </div>

              {/* Short Description */}
              <p className="mt-2 text-truncate" style={{ maxWidth: "80%" }}>
                {report.description}
              </p>

              {/* View More Button */}
              <div
                className={`d-flex ${report.viewed === 0 ? "justify-content-end" : "justify-content-between"
                  }`}
              >
                {report.viewed !== 0 && (
                  <p className="text-truncate mb-0 text-muted" style={{ maxWidth: "80%" }}>
                    {report.viewed === 1 ? "Viewed" : report.viewed}
                  </p>
                )}
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setExpandedReport(report)}
                >
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {expandedReport && (
        <Modal show onHide={() => setExpandedReport(null)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Report Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              {/* Image Section */}
              <Col md={5} className="mb-3">
                {expandedReport.image_path ? (
                  <Image
                    src={`${import.meta.env.VITE_IMAGES}/${expandedReport.image_path}`}
                    alt="Report"
                    fluid
                    rounded
                    className="border"
                    style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center border rounded bg-light" style={{ height: "300px" }}>
                    <span className="text-muted">No Image Available</span>
                  </div>
                )}
              </Col>

              {/* Details Section */}
              <Col md={7}>
                <h5 className="fw-bold mb-2">{expandedReport.location}</h5>
                <span
                  className={`badge px-3 py-2 fs-6 mb-3 ${expandedReport.status === "Pending"
                      ? "bg-warning text-dark"
                      : expandedReport.status === "In Progress"
                        ? "bg-primary"
                        : "bg-success"
                    }`}
                >
                  {expandedReport.status}
                </span>

                <p className="text-muted mb-1">
                  <strong>Reported on:</strong> {FormatDate(expandedReport.created_at)}
                </p>

                <hr />

                <p>
                  <strong>Description:</strong>
                  <br />
                  {expandedReport.description}
                </p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => setExpandedReport(null)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}

      <PaginationControls
        filteredReports={filteredReports}
        pageSize={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handlePageSizeChange={handlePageSizeChange}
        // showPageSizeSelect={false}
        pageSizeOptions={[
          { value: 4, label: "4 per page" },
          { value: 8, label: "8 per page" },
          { value: 12, label: "12 per page" },
          { value: 16, label: "16 per page" },
          { value: 20, label: "20 per page" },]}
      />
    </Container>
  );
}

export default UserReports;
