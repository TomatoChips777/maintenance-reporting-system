import { Modal, Button, Row, Col, Form, Image } from 'react-bootstrap';
import FormatDate from '../../../extra/DateFormat';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const ViewReport = ({ show, handleClose, report }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    priority: '',
    status: '',
    report_type: '',
    location: '',
    category: '',
    acknowledged_by: user?.id,
  });
  const [saving, setSaving] = useState(false);

  // For confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);

  // For validation/error modal
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (report) {
      setFormData({
        priority: report.priority || '',
        status: report.status || '',
        report_type: report.report_type || '',
        location: report.location || '',
        category: formData.category || '',
        acknowledged_by: user?.id,

      });
    }
  }, [report]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "status" &&
      ((report?.status === "Resolved" && value !== "Resolved") ||
        (report?.status === "In Progress" && value === "Pending"))
    ) {
      setPendingChange({ name, value });
      setShowConfirm(true);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const confirmStatusChange = () => {
    if (pendingChange) {
      setFormData((prev) => ({
        ...prev,
        [pendingChange.name]: pendingChange.value
      }));
    }
    setShowConfirm(false);
    setPendingChange(null);
  };

  const cancelStatusChange = () => {
    setShowConfirm(false);
    setPendingChange(null);
  };
  const handleSave = async () => {
    if (!report?.id) return;


    if (!formData.priority || !formData.report_type) {
      setErrorMessage("Please select both a priority level and a report type before saving.");
      setShowError(true);
      return;
    } else if (!formData.priority) {
      setErrorMessage("Please select a priority level before saving.");
      setShowError(true);
      return;
    } else if (!formData.report_type) {
      setErrorMessage("Please select a report type before saving.");
      setShowError(true);
      return;
    }

    try {
      setSaving(true);
      const response = await axios.put(
        `${import.meta.env.VITE_UPDATE_REPORT}/${report.id}`,
        formData
      );

      if (response.status === 200) {
        handleClose();
      } else {
        setErrorMessage("Failed to save changes. Please try again.");
        setShowError(true);
      }
    } catch (error) {
      console.error("Failed to update report:", error);
      setErrorMessage("Failed to save changes. Please try again.");
      setShowError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Main Report Modal */}
      <Modal show={show} onHide={handleClose} size="xl" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Viewing Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            {report?.image_path && (
              <div className="mb-3 text-center">
                <Image
                  src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
                  alt="Report"
                  fluid
                  style={{
                    maxHeight: '350px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              </div>
            )}
            <Col sm={3}><strong>Date:</strong></Col>
            <Col>{FormatDate(report?.created_at)}</Col>
          </Row>
          <Row className="mb-3">
            <Col sm={3}><strong>Reported By:</strong></Col>
            <Col>{report?.reporter_name || "—"}</Col>
          </Row>
          <Row className="mb-3">
            <Col sm={3}><strong>Location:</strong></Col>
            <Col>{report?.location || "—"}</Col>
          </Row>
          <Row className="mb-3">
            <Col sm={3}><strong>Description:</strong></Col>
            <Col>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  padding: "8px",
                  border: "1px solid #dee2e6",
                  borderRadius: "0.25rem",
                  backgroundColor: "#f8f9fa"
                }}
              >
                {report?.description || "—"}
              </div>
            </Col>
          </Row>

          {/* Priority */}
          <Row className="mb-3">
            <Col sm={3}><strong>Priority Level:</strong></Col>
            <Col>
              <Form.Group>
                <Form.Select
                  name="priority"
                  className={`${errorMessage ? 'is-invalid' : ''}`}
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </Form.Select>
                {errorMessage && (
                  <Form.Control.Feedback type='invalid'>
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Report Type */}
          <Row className="mb-3">
            <Col sm={3}><strong>Report Type:</strong></Col>
            <Col>
              <Form.Select
                name="report_type"
                value={formData.report_type}
                onChange={handleInputChange}
              >
                <option value="">Select report type</option>
                <option value="Incident" disabled={true}>Incident</option>
                <option value="Lost And Found" disabled={true}>Lost And Found</option>
                <option value="Maintenance">Maintenance</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Issue Type - only if Maintenance */}
          {formData.report_type === "Maintenance" && (
            <Row className="mb-3">
              <Col sm={3}><strong>Category:</strong></Col>
              <Col>

                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="General Repair">General Repair</option>
                  <option value="Others">Others</option>
                </Form.Select>
              </Col>
            </Row>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant='secondary' onClick={handleClose} disabled={saving}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={cancelStatusChange} centered animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {report?.status === "Resolved" && (
            <p>This report is already <strong>Resolved</strong>. Do you want to reopen it?</p>
          )}
          {report?.status === "In Progress" && (
            <p>This report is already <strong>In Progress</strong>. Do you want to mark it as Pending?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelStatusChange}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmStatusChange}>
            Yes, Change
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Validation/Error Modal */}
      <Modal show={showError} onHide={() => setShowError(false)} centered animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowError(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewReport;
