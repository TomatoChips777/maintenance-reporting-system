import { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Alert, Modal } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../AuthContext";
import axios from "axios";

function ReportPage() {
  const { user, signIn } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    user_id: user?.id || "",
    location: "",
    description: "",
    urgency: "Normal",
    image: null,
    issue_type: "",
    is_anonymous: false,
    report_type: 'Maintenance',
  });

  const resetForm = () => {
    setFormData({
      user_id: user?.id || "",
      location: "",
      description: "",
      urgency: "Normal",
      image: null,
      issue_type: "",
      is_anonymous: false,
      report_type: 'Maintenance',
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [successModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      user_id: user?.id || "",
    }));
  }, [user]);

  // Google Login
  const handleGoogleLogin = async (credentialsResponse) => {
    setLoading(true);
    try {
      const decodedToken = jwtDecode(credentialsResponse.credential);
      const user = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        photo: decodedToken.picture,
      };
      const response = await axios.post(`${import.meta.env.VITE_LOGIN_API}`, {
        email: user.email,
        name: user.name,
        picture: user.photo,
        token: user.id,
      });
      signIn(response.data);
      setShowGoogleLogin(false);
    } catch {
      setError("Error logging in with Google");
    } finally {
      setLoading(false);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowGoogleLogin(true);
      return;
    }
    handleFormSubmission();
  };

  const handleFormSubmission = async () => {
    setLoading(true);
    if (!formData.location.trim() || !formData.description.trim()) {
      setErrorMessage("Location and description are required.");
      setLoading(false);
      return;
    }
    try {
      const submissionData = new FormData();
      submissionData.append("user_id", formData.user_id);
      submissionData.append("location", formData.location);
      submissionData.append("description", formData.description);
      submissionData.append("urgency", formData.urgency);
      submissionData.append("issue_type", formData.issue_type);
      submissionData.append("is_anonymous", formData.is_anonymous ? 1 : 0);
      submissionData.append("report_type", formData.report_type);
      if (formData.image) {
        submissionData.append("image", formData.image);
      }

      await axios.post(`${import.meta.env.VITE_USER_CREATE_REPORT}`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      setError("");
      setShowSuccessModal(true);
    } catch {
      setError("Failed to submit the report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="bg-dark text-white p-2">Report Form</h3>

      <Form onSubmit={handleSubmit} className="border p-3 bg-light">
        <p className="text-muted">
          Please fill out the details below to report any broken equipment,
          facility issue, or maintenance concern within the campus.
        </p>

        {/* Location */}
        <Form.Group className="mb-2">
          <Form.Label>Location of Issue</Form.Label>
          <Form.Control
            className={`rounded-0 p-2 ${errorMessage ? 'is-invalid' : ''}`}
            type="text"
            placeholder="e.g. Library - 2nd Floor"
            required
            value={formData.location}
            onChange={(e) => { setFormData({ ...formData, location: e.target.value.replace(/\s+/g, " ").trimStart() }); setErrorMessage(""); }
            }
          />
          {errorMessage && (
            <Form.Control.Feedback type="invalid">
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-2">
          <Form.Label>Issue Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Describe the issue..."
            required
            value={formData.description}
            onChange={(e) => { setFormData({ ...formData, description: e.target.value.trimStart() }); setErrorMessage(""); }
            }
          />
        </Form.Group>

        {/* Upload Image */}
        <Form.Group className="mb-2">
          <Form.Label>Upload Image (optional)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
          />
        </Form.Group>

        {/* Anonymous Checkbox */}
        <Form.Group className="mb-2">
          <Form.Check
            type="checkbox"
            label="Submit Anonymously"
            checked={formData.is_anonymous}
            onChange={(e) =>
              setFormData({ ...formData, is_anonymous: e.target.checked })
            }
          />
        </Form.Group>

        {error && <Alert variant="danger rounded-0">{error}</Alert>}
        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </div>

      </Form>

      {/* Google Login Modal */}
      <Modal show={showGoogleLogin} onHide={() => setShowGoogleLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In with Google</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please sign in with your Google account to submit the report.</p>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Error during Google login")}
            theme="outline"
            width="100%"
          />
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={successModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your report has been submitted successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSuccessModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ReportPage;
