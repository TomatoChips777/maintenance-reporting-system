import { Modal, Button, Row, Col, Form, Image } from 'react-bootstrap';
import FormatDate from '../../../extra/DateFormat';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search } from 'react-bootstrap-icons';

const ViewReport = ({ show, handleClose, report, staff }) => {
  const [formData, setFormData] = useState({
    priority: '',
    status: '',
    category: '',
    location: '',
    schedule_date: '',
    assigned_staff: [],
  });
  const [saving, setSaving] = useState(false);
  // For confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [showSendBack, setShowSendBack] = useState(null);

  const [successModal, setShowSuccessModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchStaff, setSearchStaff] = useState("");

  useEffect(() => {
    if (report) {
      setFormData({
        priority: report.priority || '',
        status: report.status || '',
        category: report.category || '',
        location: report.location || '',
        schedule_date: report.schedule_date || '',// default if exists,
        assigned_staff: report.assigned_staff
          ? report.assigned_staff.split(",").map(String)
          : [],
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

  const handleStaffChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      assigned_staff: options,
    }));
  };

  const filterStaff = useMemo(() => {
    return staff.filter(staff => {
      const matchesSearch = staff.name?.toLowerCase().includes(searchStaff.toLocaleLowerCase()) ||
                            staff.role?.toLowerCase().includes(searchStaff.toLowerCase());
      return matchesSearch;
    });
  }, [staff, searchStaff]);


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

    if (!formData.priority || !formData.category) {
      setErrorMessage("Please select both a priority level and a category before saving.");
      setShowError(true);
      return;
    } else if (!formData.priority) {
      setErrorMessage("Please select a priority level before saving.");
      setShowError(true);
      return;
    } else if (!formData.category) {
      setErrorMessage("Please select a category before saving.");
      setShowError(true);
      return;
    }
    const payload = {
      ...formData,
      assigned_staff: formData.assigned_staff.join(","),
    };

    try {
      setSaving(true);
      const response = await axios.put(
        `${import.meta.env.VITE_UPDATE_MAINTENANCE_REPORT}/${report.id}`,
        payload
      );
      if (response.status === 200) {
        handleClose();
        setShowSuccessModal(true);
      } else {
        setErrorMessage("Failed to save changes. Please try again.");
        setShowError(true);
      }
    } catch (error) {
      // console.error("Failed to update report:", error);
      setErrorMessage("Failed to save changes. Please try again.");
      setShowError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSendBack = () => {
    setShowSendBack(true);
  };

  const confirmSendBack = async () => {
    if (!report?.id) return;

    try {
      setSaving(true);
      const response = await axios.put(
        `${import.meta.env.VITE_SEND_BACK_REPORT}/${report.id}`,
        { reason: "Not related to this department" }
      );

      if (response.status === 200) {
        setShowSendBack(false);
        handleClose();
      } else {
        alert("Failed to send back. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send back report:", error);
      alert("Error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Main Report Modal */}
      <Modal show={show} onHide={() => {handleClose(); setSearchStaff('');}} size="lg" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Viewing Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

          {/* Meta Info */}
          <Row className="mb-3">
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

          {/* Description */}
          <Row className="mb-4">
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

          {/* Editable Fields in Row/Col layout */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Priority Level</strong></Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Category</strong></Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select issue type</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="General Repair">General Repair</option>
                  <option value="Others">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Status</strong></Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value=""></option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Set Schedule</strong><small className='text-muted'>(Optional)</small></Form.Label>
                <Form.Control
                  type="date"
                  name="schedule_date"
                  value={formData.schedule_date}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>


          <Row className="mb-3">
            <Col sm={3}><strong>Assigned Staff:</strong></Col>
            <Col>
            <p style={{fontSize: '12px', fontWeight: 'lighter'}} className='text-muted'>{report?.assigned_staff
                ? report.assigned_staff
                  .split(",")
                  .map((id) => {
                    const s = staff.find((s) => s.id == id && s.status === 1);
                    return s ? s.name : null;
                  })
                  .filter(Boolean) // remove nulls (inactive staff)
                  .join(", ") || "—"
                : "—"}</p>
              
            </Col>
            <Form.Group>
              {/* Search Staff */}
              <Form.Control
                type="text"
                placeholder="🔍 Search staff..."
                value={searchStaff}
                onChange={(e) => setSearchStaff(e.target.value)}
                className="mb-2"
              />

              {/* Header */}
              <div className="d-flex justify-content-between px-2 py-1 bg-light border border-bottom-0 rounded-0 mb-1">
                <strong>Name</strong>
                <strong>Role</strong>
              </div>

              {/* Staff List */}
              <div
                style={{
                  maxHeight: "220px",
                  overflowY: "auto",
                  border: "1px solid #dee2e6",
                  borderRadius: "0px",
                  padding: "6px",
                  borderTop: '0px',
                  background: "#fff",
                }}
              >
                {filterStaff.length > 0 ? (
                  filterStaff
                    .filter((s) => s.status === 1)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((s) => (
                      <div
                        key={s.id}
                        className="d-flex justify-content-between align-items-center border-bottom py-1"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`staff-${s.id}`}
                          value={s.id}
                          checked={formData.assigned_staff.includes(String(s.id))}
                          onChange={(e) => {
                            const { checked, value } = e.target;
                            setFormData((prev) => ({
                              ...prev,
                              assigned_staff: checked
                                ? [...prev.assigned_staff, value]
                                : prev.assigned_staff.filter((id) => id !== value),
                            }));
                          }}
                          label={s.name}
                          className="me-2"
                          style={{fontSize: '12px'}}
                        />
                        <small className='text-muted' style={{fontSize: '10px'}}>{s.role}</small>
                      </div>
                    ))
                ) : (
                  <p className="text-muted text-center mb-0">No staff available</p>
                )}
              </div>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {/* {report?.status === 'Pending' && (
            <Button variant="danger" onClick={handleSendBack} disabled={saving}>
              Send Back
            </Button>
          )} */}
          <Button variant="secondary" onClick={() =>{handleClose(); setSearchStaff('');}} disabled={saving}>
            Close
          </Button>
          <Button variant="success" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
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

      {/* Send Back Confirmation Modal */}
      <Modal show={showSendBack} onHide={() => setShowSendBack(false)} centered animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Send Back Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to send this report back to the
            <strong> Report Manager</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSendBack(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmSendBack} disabled={saving}>
            {saving ? "Sending..." : "Yes, Send Back"}
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

      {/* Success Modal */}
      <Modal show={successModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Updated</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The report has been successfully updated.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowSuccessModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewReport;
