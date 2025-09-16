import { Modal, Button, Form } from 'react-bootstrap';

function AddUserModal({ show, onHide, onSubmit, newUser, handleChange }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3 p-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
            className='p-2'
              type="text"
              placeholder="Enter a name"
              name="name"
              value={newUser.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
            className='p-2'
              type="email"
              placeholder="Enter a email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Paasword</Form.Label>
            <Form.Control
            className='p-2'
              type="password"
              placeholder="Enter a password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Role</Form.Label>
            <Form.Control
            className='p-2'
              as="select"
              name="role"
              value={newUser.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Staff">Staff</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Status</Form.Label>
            <Form.Control
            className='p-2'
              as="select"
              name="status"
              value={newUser.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Control>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={() => onSubmit(newUser)}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddUserModal;
