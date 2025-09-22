import { Button, Form, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";

const ArchiveAlert = ({ show, handleClose, report }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] =useState(false);

  const handleArchiveReport = async () => {
    setLoading(true);
    if(!reason.trim()){
      setError("Reason is required before archiving");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_ARCHIVE_REPORT}/${report.id}`,
        {reason}
      );
 
      // If backend responds with success
      if (response.status === 200 && response.data?.success) {
        console.log("Report archived successfully");
        setReason("");
        setError("");
        handleClose();
      } else {
        console.warn("Failed to archive:", response.data);
      }
    } catch (error) {
      console.error("Error archiving report:", error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={() => {handleClose(); setReason("");}} size="lg" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Archive Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <small>Are you sure you want to archive this report?</small>
        <Form.Group className="mt-3">
        <Form.Control
        className={`${error ? 'is-invalid' : ''}`}
        as="textarea"
        rows={3}
        placeholder="Enter reason for archiving..."
        value={reason}
        onChange={(e) => {setReason(e.target.value); setError("");}}
        />
        {/* {error && <small className="text-danger">{error}</small>} */}
        {error && (
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={() => {handleClose(); setReason("");}}>
          Cancel
        </Button>
        <Button variant="warning" onClick={handleArchiveReport} disabled={loading}>
          {/* Archive */}
          {loading ? <Spinner animation="border" size="sm" /> : 'Archive'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArchiveAlert;
