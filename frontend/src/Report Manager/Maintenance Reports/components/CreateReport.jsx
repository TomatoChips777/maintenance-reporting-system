import { useState } from 'react';
import { Modal, Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../../../AuthContext';
import axios from 'axios';

const CreateReport = ({ show, handleClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: user.id,
    location: '',
    category: '',
    priority: '',
    assigned_staff: '',
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
      assigned_staff: '',
      status: '',
      image: null,
      description: '',
      report_type: 'Maintenance',
      is_anonymous: false, 
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    Object.entries({ ...formData, user_id: user?.id }).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formDataObj.append(key, value);
      }
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_CREATE_MAINTENANCE_REPORT}`,
        formDataObj,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        handleClose();
        resetForm();
      }
    } catch (error) {
      console.log('Error creating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" animation={false}>
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

          {/* Third row: Assigned Staff */}
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Assigned Staff <small className='text-muted'>(Optional)</small></Form.Label>
                <Form.Control
                  type="text"
                  name="assigned_staff"
                  value={formData.assigned_staff}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

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
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="dark" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateReport;
