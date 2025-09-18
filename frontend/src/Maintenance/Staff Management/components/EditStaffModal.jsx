import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useMemo } from 'react';

function EditStaffModal({ show, onHide, onSave, staff, handleChange, uniqueRoles }) {
  const [emailError, setEmailError] = useState("");

  const handleSave = async () => {
    try {
      await onSave(staff);
      setEmailError("");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setEmailError(err.response.data.error);
      } else {
        setEmailError("Something went wrong.");
      }
    }
  };


  return (
    <Modal show={show} onHide={onHide} centered size="lg" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3 p-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              className="p-2 rounded-0"
              type="text"
              placeholder="Enter user name"
              name="name"
              value={staff.name}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\s+/g, " ").trimStart(); // allow single spaces only
                handleChange(e);
                setEmailError(""); // reset error on typing
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className={`rounded-0 p-2 ${emailError ? 'is-invalid' : ''}`}
              type="email"
              placeholder="Enter user email"
              name="email"
              value={staff.email}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\s/g, "").trimStart(); // remove ALL spaces
                handleChange(e);
                setEmailError(""); // reset error when editing
              }}
            />
            {emailError && (
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              list="roleOptions"
              placeholder="Enter or select role"
              name="role"
              value={staff.role}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\s+/g, " ").trimStart();
                handleChange(e);
              }}
            />
            <datalist id="roleOptions">
              {uniqueRoles.map((role, index) => (
                <option key={index} value={role} />
              ))}
            </datalist>
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Status</Form.Label>
            <Form.Control
              className="p-2 rounded-0"
              as="select"
              name="status"
              value={String(staff.status)}
              onChange={handleChange}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary rounded-0" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary rounded-0" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditStaffModal;
