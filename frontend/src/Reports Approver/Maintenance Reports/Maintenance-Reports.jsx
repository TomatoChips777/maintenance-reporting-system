
import { useMemo, useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form, Button, Spinner } from 'react-bootstrap';
import PaginationControls from '../../extra/Paginations';
import ViewReport from './components/ViewReport';
import CreateReport from './components/CreateReport';
import ArchiveAlert from './components/ArchiveAlert';
import axios from 'axios';
import FormatDate from '../../extra/DateFormat';
import TextTruncate from '../../extra/TextTruncate';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function MaintenanceReports() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedReport, setSelectedReport] = useState('');
  const [reportToRemove, setReportToRemove] = useState('');
  const [loading, setLoading] = useState(true);

  // fetch reports
  const fetchReports = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_MAINTENANCE_REPORT}`);
      setReports(response.data.reports);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        const matchesSearch =
          report.description.toLowerCase().includes(search.toLowerCase()) ||
          report.location.toLowerCase().includes(search.toLowerCase()) ||
          report.reporter_name.toLowerCase().includes(search.toLowerCase());

          const matchesStatus = report.status === 'Pending'
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const order = { Pending: 1, "In Progress": 2, Resolved: 3 };
        return (order[a.status] || 99) - (order[b.status] || 99);
      });
  }, [reports, search]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReports, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchReports();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateReports', fetchReports);
    return () => socket.disconnect();
  }, []);

  const handleOpenViewModal = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };
  const handleCloseViewModal = () => setShowViewModal(false);
  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleShowAlert = (report) => {
    setShowAlert(true);
    setReportToRemove(report);
  };
  const handleCloseAlert = () => setShowAlert(false);

  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleViewReport = (report) => {
    navigate('/maintenance-view-report', { state: { reportId: report?.id } });
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

  return (
    <Container fluid className="p-0">
      <Card className="p-3">
        <h2 className="fw-bold mb-4 text-center">Reports Management</h2>

        {/* Search + New Report */}
        <Row className="mb-3 align-items-end px-3">
          <Col md={10}>
            <Form.Group controlId="searchReports">
              <Form.Label className="fw-semibold small text-muted">Search Reports</Form.Label>
              <Form.Control
                className="p-2"
                type="text"
                placeholder="Search by description, location, or reporter"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex justify-content-end">
            <Button variant="dark" className="px-3 py-2" onClick={handleOpenCreateModal}>
              <i className="bi bi-plus-circle me-2"></i>
              New Report
            </Button>
          </Col>
        </Row>

        {/* Reports List */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 mb-0 small text-muted">Loading reports...</p>
            </div>
          </div>
        ) : currentData.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <p className="text-muted mb-0">No reports found.</p>
          </div>
        ) : (
          <ul className="list-unstyled row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 px-3">
            {currentData.map((report, index) => (
              <li key={index} className="col">
                <Card className="h-100 shadow-sm border-1">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fw-semibold small text-muted">{FormatDate(report.created_at)}</span>
                      <span className="fw-bold small text-uppercase">
                        <u>{report.status}</u>
                      </span>
                    </div>

                    <h6 className="fw-bold">{report.issue_type}</h6>
                    <p className="mb-1 text-muted small">
                      <i className="bi bi-person-fill me-2"></i>
                      {report.is_anonymous ? 'Anonymous' : report.reporter_name}
                    </p>
                    <p className="mb-1 small">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      <TextTruncate text={report.location} maxLength={30} />
                    </p>
                    <p className="mb-2 small text-muted">
                      <TextTruncate
                        text={
                          report?.description
                            ? report.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
                            : 'No description provided.'
                        }
                        maxLength={50}
                      />
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small fst-italic">{getTimeAgo(report.created_at)}</span>
                      <div>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewReport(report)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button
                          variant="dark"
                          size="sm"
                          onClick={() => handleShowAlert(report)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <Card.Footer>
          <PaginationControls
            filteredReports={filteredReports}
            pageSize={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handlePageSizeChange={handlePageSizeChange}
            pageSizeOptions={[
              { value: 9, label: '9 per page' },
              { value: 18, label: '18 per page' },
              { value: 27, label: '27 per page' },
              { value: 36, label: '36 per page' },
              { value: 45, label: '45 per page' },
            ]}
          />
        </Card.Footer>
      </Card>

      <ViewReport show={showViewModal} handleClose={handleCloseViewModal} report={selectedReport} />
      <CreateReport show={showCreateModal} handleClose={handleCloseCreateModal} />
      <ArchiveAlert show={showAlert} handleClose={handleCloseAlert} report={reportToRemove} />
    </Container>
  );
}

export default MaintenanceReports;
