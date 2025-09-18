import { useState, useMemo } from 'react';
import { Modal, Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../../../AuthContext';
import axios from 'axios';

const CreateReport = ({ show, handleClose, staff }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successModal, setShowSuccessModal] = useState(false);
  const [searchStaff, setSearchStaff] = useState('');
  
  const [formData, setFormData] = useState({
    user_id: user.id,
    location: '',
    category: '',
    priority: '',
    assigned_staff: [],
    status: '',
    image: null,
    description: '',
    report_type: 'Maintenance',
    is_anonymous: false,
  });

  const resetForm = () => {
    setFormData({
      user_id: user.id,
      location: '',
      category: '',
      priority: '',
      assigned_staff: [],
      status: '',
      image: null,
      description: '',
      report_type: 'Maintenance',
      is_anonymous: false,
    });
  };

  const filterStaff = useMemo(() =>{
    return staff.filter(staff =>{
      const matchesSearch = staff.name?.toLowerCase().includes(searchStaff.toLowerCase()) ||
                            staff.role?.toLowerCase().includes(searchStaff.toLowerCase());
      ;
      return matchesSearch;
    })
  }, [staff, searchStaff ]);

  const handleStaffChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData((prev) => ({
      ...prev,
      assigned_staff: options,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const formDataObj = new FormData();
  //   Object.entries({ ...formData, user_id: user?.id }).forEach(([key, value]) => {
  //     if (value !== null && value !== undefined && value !== '') {
  //       formDataObj.append(key, value);
  //     }
  //   });

  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_CREATE_MAINTENANCE_REPORT}`,
  //       formDataObj,
  //       { headers: { 'Content-Type': 'multipart/form-data' } }
  //     );

  //     if (response.data.success) {
  //       setShowSuccessModal(true);
  //       handleClose();
  //       resetForm();
  //     }
  //   } catch (error) {
  //     console.log('Error creating report:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    Object.entries({ ...formData, user_id: user?.id }).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === "assigned_staff") {
          formDataObj.append(key, value.join(","));
        } else {
          formDataObj.append(key, value);
        }
      }
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_CREATE_MAINTENANCE_REPORT}`,
        formDataObj,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setShowSuccessModal(true);
        handleClose();
        resetForm();
        setSearchStaff('');
      }
    } catch (error) {
      console.log('Error creating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={() => {handleClose(); setSearchStaff('')}} size="lg" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>New Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* First row: Location + Category */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="General Repair">General Repair</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Second row: Priority + Status */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
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
                      />
                      <small className='text-muted'>{s.role}</small>
                    </div>
                  ))
              ) : (
                <p className="text-muted text-center mb-0">No staff available</p>
              )}
            </div>
          </Form.Group>
            {/* Fourth row: Upload Image */}
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Fifth row: Description */}
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Buttons */}
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => {handleClose(); setSearchStaff('');}}>
                Close
              </Button>
              <Button variant="dark" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={successModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The report has been successfully posted.</p>
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

export default CreateReport;
