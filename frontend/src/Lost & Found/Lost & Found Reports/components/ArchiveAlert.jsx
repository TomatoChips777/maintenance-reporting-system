import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";

const ArchiveAlert = ({ show, handleClose, report }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleArchiveReport = async () => {
    if(!reason.trim()){
      setError("Reason is required before archiving");
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
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Archive Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <small>Are you sure you want to archive this report?</small>
        <Form.Group className="mt-3">
        <Form.Control
        as="textarea"
        rows={3}
        placeholder="Enter reason for archiving..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        />
        {error && <small className="text-danger">{error}</small>}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="warning" onClick={handleArchiveReport}>
          Archive
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArchiveAlert;
