import { Modal, Button, Form } from 'react-bootstrap';

function EditUserModal({ show, onHide, onSave, user, handleChange }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3 p-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
            className='p-2'
              type="text"
              placeholder="Enter user name"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
            className='p-2'
              type="email"
              placeholder="Enter user email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Role</Form.Label>
            <Form.Control
            className='p-2'
              as="select"
              name="role"
              value={user.role}
              onChange={handleChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Report Manager">Report Manager</option>
              <option value="Maintenance Manager">Maintenance Manager</option>
              <option value="Incident Manager">Incident Manager</option>
              <option value="Lost & Found Manager">Lost & Found Manager</option>

            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Status</Form.Label>
            <Form.Control
            className='p-2'
              as="select"
              name="status"
              value={user.status}
              onChange={handleChange}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </Form.Control>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave(user)}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditUserModal;
