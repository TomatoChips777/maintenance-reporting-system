import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';

function AddStaffModal({ show, onHide, onSubmit, newStaff, handleChange, uniqueRoles }) {
  const [emailError, setEmailError] = useState("");

  const handleSave = async () => {
    try {
      // clean input fields before saving
      const cleanedStaff = {
        ...newStaff,
        name: newStaff.name.trim().replace(/\s+/g, " "),
        email: newStaff.email.trim(),
        contact_number: newStaff.contact_number.trim().replace(/\s/g, ""),
        role: newStaff.role.trim().replace(/\s+/g, " "),
      };

      await onSubmit(cleanedStaff);
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
    <Modal show={show} onHide={onHide} size="lg" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Name */}
          <Form.Group className="mb-1 p-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              className="p-2 rounded-0"
              type="text"
              placeholder="Enter a name"
              name="name"
              value={newStaff.name}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\s+/g, " ").trimStart(); // only single spaces
                handleChange(e);
              }}
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-1 p-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className={`rounded-0 p-2 ${emailError ? 'is-invalid' : ''}`}
              type="email"
              placeholder="Enter an email"
              name="email"
              value={newStaff.email}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\s/g, ""); // remove ALL spaces
                handleChange({ target: { name: e.target.name, value: cleaned } });
                setEmailError("");
              }}
            />
            {emailError && (
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Contact Number */}
          <Form.Group className="mb-1 p-2">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              className="p-2 rounded-0"
              type="text"
              placeholder="Enter a contact number"
              name="contact_number"
              value={newStaff.contact_number}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\s/g, "").trimStart(); // no spaces
                handleChange(e);
              }}
            />
          </Form.Group>

          {/* Role */}
          <Form.Group className="mb-1 p-2">
            <Form.Label>Role <small className='text-muted'>(Optional)</small></Form.Label>
            <Form.Control
              className="p-2 rounded-0"
              type="text"
              list='roleOptions'
              placeholder="Enter a role (Optional)"
              name="role"
              value={newStaff.role}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\s+/g, " ").trimStart();; // only single spaces
                handleChange(e);
              }}
            />
            <datalist id="roleOptions">
              {uniqueRoles.map((role, index) => (
                <option key={index} value={role} />
              ))}
            </datalist>
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-1 p-2">
            <Form.Label>Status</Form.Label>
            <Form.Select
              className="p-2 rounded-0"
              name="status"
              value={newStaff.status}
              onChange={handleChange}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary rounded-0" onClick={onHide}>Cancel</Button>
        <Button variant="primary rounded-0" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AddStaffModal;
