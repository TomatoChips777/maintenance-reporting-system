import { Modal, Button, Form } from 'react-bootstrap';

function AddStaffModal({ show, onHide, onSubmit, newUser, handleChange }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Staff</Modal.Title>
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
            <Form.Label>Contanct Number</Form.Label>
            <Form.Control
            className='p-2'
              type="contact_number"
              placeholder="Enter a contact number"
              name="contact_number"
              value={newUser.contact_number}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 p-2">
            <Form.Label>Role <small className='text-muted'>(Optional)</small></Form.Label>
            <Form.Control
            className='p-2'
              type="text"
              placeholder="Enter a role (Optional)"
              name="role"
              value={newUser.role}
              onChange={handleChange}
            />
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

export default AddStaffModal;
