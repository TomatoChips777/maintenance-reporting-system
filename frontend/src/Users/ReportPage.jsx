// import { useState, useEffect, useRef } from "react";
// import { Container, Card, Form, Button, Alert, Modal } from "react-bootstrap";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import { useAuth } from "../../AuthContext";
// import axios from "axios";

// function ReportPage() {
//   const { user, signIn } = useAuth();
//   const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     user_id: user?.id || "",
//     location: "",
//     description: "",
//     urgency: "Normal",
//     image: null,
//     issue_type: "",
//     is_anonymous: false,
//   });

//   const resetForm = () => {
//     setFormData({
//       user_id: user?.id || "",
//       location: "",
//       description: "",
//       urgency: "Normal",
//       image: null,
//       issue_type: "",
//       is_anonymous: false,
//     });
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showGoogleLogin, setShowGoogleLogin] = useState(false);
//   const [successModal, setShowSuccessModal] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       user_id: user?.id || "",
//     }));
//   }, [user]);

//   // Google Login
//   const handleGoogleLogin = async (credentialsResponse) => {
//     setLoading(true);
//     try {
//       const decodedToken = jwtDecode(credentialsResponse.credential);
//       const user = {
//         id: decodedToken.sub,
//         name: decodedToken.name,
//         email: decodedToken.email,
//         photo: decodedToken.picture,
//       };
//       const response = await axios.post(`${import.meta.env.VITE_LOGIN_API}`, {
//         email: user.email,
//         name: user.name,
//         picture: user.photo,
//         token: user.id,
//       });
//       signIn(response.data);
//       setShowGoogleLogin(false);
//     } catch (error) {
//       setError("Error logging in with Google");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) {
//       setShowGoogleLogin(true);
//       return;
//     }
//     handleFormSubmission();
//   };

//   const handleFormSubmission = async () => {
//     setLoading(true);
//     try {
//       const submissionData = new FormData();
//       submissionData.append("user_id", formData.user_id);
//       submissionData.append("location", formData.location);
//       submissionData.append("description", formData.description);
//       submissionData.append("urgency", formData.urgency);
//       submissionData.append("issue_type", formData.issue_type);
//       submissionData.append("is_anonymous", formData.is_anonymous ? 1 : 0);
//       if (formData.image) {
//         submissionData.append("image", formData.image);
//       }

//       await axios.post(`${import.meta.env.VITE_CREATE_REPORT}`, submissionData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       resetForm();
//       setImagePreview(null);
//       setShowSuccessModal(true);
//     } catch (error) {
//       setError("Failed to submit the report");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="mt-5 mb-5">
//       <Card className="shadow-sm p-2">
//         <Card.Header className="bg-success text-white fw-bold p-4">
//           Report Form
//         </Card.Header>
//         <Card.Body>
//           <p className="text-muted">
//             Please fill out the details below to report any broken equipment,
//             facility issue, or maintenance concern within the campus.
//           </p>

//           <Form onSubmit={handleSubmit}>
//             {/* Location */}
//             <Form.Group className="mb-3">
//               <Form.Label>Location of Issue</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="e.g. Library - 2nd Floor"
//                 required
//                 value={formData.location}
//                 onChange={(e) =>
//                   setFormData({ ...formData, location: e.target.value })
//                 }
//                 className="p-3"
//               />
//             </Form.Group>
//             {/* Description */}
//             <Form.Group className="mb-3">
//               <Form.Label>Issue Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={5}
//                 placeholder="Describe the issue in detail..."
//                 required
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//                 className="p-3"
//               />
//             </Form.Group>

//             {/* Upload Image */}
//             <Form.Group className="mb-3">
//               <Form.Label>Upload Image (optional)</Form.Label>
//               <Form.Control
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   setFormData({ ...formData, image: file });
//                   if (file) {
//                     const reader = new FileReader();
//                     reader.onloadend = () => setImagePreview(reader.result);
//                     reader.readAsDataURL(file);
//                   }
//                 }}
//                 className="p-3"
//               />
//               {imagePreview && (
//                 <div className="mt-2 text-center">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     style={{ maxWidth: "200px", borderRadius: "8px" }}
//                   />
//                 </div>
//               )}
//             </Form.Group>

//             {/* Anonymous Checkbox */}
//             <Form.Group className="mb-3 d-flex justify-content-end">
//               <Form.Check
//                 type="checkbox"
//                 label="Submit Anonymously"
//                 name="is_anonymous"
//                 checked={formData.is_anonymous}
//                 onChange={(e) =>
//                   setFormData({ ...formData, is_anonymous: e.target.checked })
//                 }
//               />
//             </Form.Group>

//             {error && <Alert variant="danger">{error}</Alert>}

//             {/* Submit */}
//             <div className="d-flex justify-content-end">
//               <Button
//                 variant="primary"
//                 type="submit"
//                 disabled={loading}
//                 className="p-2"
//               >
//                 {loading ? "Submitting..." : "Submit Report"}
//               </Button>
//             </div>
//           </Form>
//         </Card.Body>
//       </Card>

//       {/* Google Login Modal */}
//       <Modal show={showGoogleLogin} onHide={() => setShowGoogleLogin(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Sign In with Google</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Please sign in with your Google account to submit the report.</p>
//           <GoogleLogin
//             onSuccess={handleGoogleLogin}
//             onError={() => setError("Error during Google login")}
//             theme="filled_blue"
//             shape="rectangular"
//             text="signin_with"
//             width="100%"
//           />
//         </Modal.Body>
//       </Modal>

//       {/* Success Modal */}
//       <Modal show={successModal} onHide={() => setShowSuccessModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Report Submitted</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Your report has been submitted successfully! ✅</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="success" onClick={() => setShowSuccessModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }
// export default ReportPage;

import { useState, useEffect, useRef } from "react";
import { Container, Card, Form, Button, Alert, Modal, Nav } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../AuthContext";
import axios from "axios";

function ReportPage() {
  const { user, signIn } = useAuth();
  const fileInputRef = useRef(null);

  const [selectedForm, setSelectedForm] = useState("Maintenance"); 

  const [formData, setFormData] = useState({
    user_id: user?.id || "",
    location: "",
    description: "",
    urgency: "Normal",
    image: null,
    item_name: "",
    category: "",
    is_anonymous: false,
    issue_type: "Maintenance",
  });

  const resetForm = () => {
    setFormData({
      user_id: user?.id || "",
      location: "",
      description: "",
      urgency: "Normal",
      image: null,
      item_name: "",
      category: "",
      is_anonymous: false,
      issue_type: selectedForm, 
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [successModal, setShowSuccessModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      user_id: user?.id || "",
      issue_type: selectedForm, // sync with active tab
    }));
  }, [user, selectedForm]);

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
    } catch (error) {
      setError("Error logging in with Google");
    } finally {
      setLoading(false);
    }
  };

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
    try {
      const submissionData = new FormData();
      submissionData.append("user_id", formData.user_id);
      submissionData.append("location", formData.location);
      submissionData.append("description", formData.description);
      submissionData.append("urgency", formData.urgency);
      submissionData.append("issue_type", formData.issue_type);
      submissionData.append("item_name", formData.item_name);
      submissionData.append("category", formData.category);
      submissionData.append("is_anonymous", formData.is_anonymous ? 1 : 0);
      if (formData.image) {
        submissionData.append("image", formData.image);
      }

      await axios.post(`${import.meta.env.VITE_CREATE_REPORT}`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      setImagePreview(null);
      setShowSuccessModal(true);
    } catch (error) {
      setError("Failed to submit the report");
    } finally {
      setLoading(false);
    }
  };

  // --- Different forms depending on tab ---
  const renderFormFields = () => {
    switch (selectedForm) {
      case "Maintenance":
        return (
          <>
            {/* Location */}
            <Form.Group className="mb-3">
              <Form.Label>Location of Issue</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Library - 2nd Floor"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="p-3"
              />
            </Form.Group>
            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label>Issue Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="p-3"
              />
            </Form.Group>
          </>
        );

      case "Lost And Found":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Umbrella, Laptop"
                required
                value={formData.item_name}
                onChange={(e) =>
                  setFormData({ ...formData, item_name: e.target.value })
                }
                className="p-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Electronics, Clothing"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="p-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location Found/Lost</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="p-3"
              />
            </Form.Group>
          </>
        );

      case "Incident":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Incident Location</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="p-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Incident Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="p-3"
              />
            </Form.Group>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow-sm p-2">
        <Card.Header className="bg-white p-0">
          <Nav
            variant="tabs"
            activeKey={selectedForm}
            onSelect={(k) => setSelectedForm(k)}
            className="fw-bold"
          >
            <Nav.Item>
              <Nav.Link  eventKey="Maintenance">Maintenance</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Lost And Found">Lost & Found</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Incident">Incident</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {renderFormFields()}

            {/* Upload Image */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Image (optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData({ ...formData, image: file });
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreview(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                className="p-3"
              />
              {imagePreview && (
                <div className="mt-2 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "200px", borderRadius: "8px" }}
                  />
                </div>
              )}
            </Form.Group>

            {/* Anonymous Checkbox */}
            <Form.Group className="mb-3 d-flex justify-content-end">
              <Form.Check
                type="checkbox"
                label="Submit Anonymously"
                name="is_anonymous"
                checked={formData.is_anonymous}
                onChange={(e) =>
                  setFormData({ ...formData, is_anonymous: e.target.checked })
                }
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex justify-content-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      {/* Google Login Modal + Success Modal*/}
      <Modal show={showGoogleLogin} onHide={() => setShowGoogleLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In with Google</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please sign in with your Google account to submit the report.</p>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Error during Google login")}
            theme="filled_blue"
            shape="rectangular"
            text="signin_with"
            width="100%"
          />
        </Modal.Body>
      </Modal>
      <Modal show={successModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your report has been submitted successfully! ✅</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ReportPage;
