// // import { Container, Row, Col, Card, Form, Button, ListGroup } from "react-bootstrap";
// // import { useState, useEffect } from "react";
// // import { useAuth } from "../../../AuthContext";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import axios from "axios";
// // import FormatDate from "../../extra/DateFormat";

// // function ViewReportPage() {
// //   const { user } = useAuth();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { report } = location.state || {};

// //   const [formData, setFormData] = useState({
// //     priority: "",
// //     status: "",
// //     report_type: "",
// //     location: "",
// //     category: "",
// //     acknowledged_by: user?.id,
// //   });
// //   const [saving, setSaving] = useState(false);

// //   // Email/message state
// //   const [emails, setEmails] = useState([
// //     { id: 1, subject: "Need update", from: "admin@school.edu" },
// //     { id: 2, subject: "Follow-up", from: "staff@school.edu" },
// //     { id: 3, subject: "Resolved confirmation", from: "manager@school.edu" },
// //   ]);
// //   const [selectedEmail, setSelectedEmail] = useState(null);

// //   useEffect(() => {
// //     if (report) {
// //       setFormData({
// //         priority: report.priority || "",
// //         status: report.status || "",
// //         report_type: report.report_type || "",
// //         location: report.location || "",
// //         category: report.category || "",
// //         acknowledged_by: user?.id,
// //       });
// //     }
// //   }, [report]);

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   };

// //   const handleSave = async () => {
// //     if (!report?.id) return;
// //     try {
// //       setSaving(true);
// //       const response = await axios.put(
// //         `${import.meta.env.VITE_UPDATE_REPORT}/${report.id}`,
// //         formData
// //       );
// //       if (response.status === 200) {
// //         alert("Report updated successfully!");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to update report");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   return (
// //     <Container fluid className="mt-3">
// //       <Row>
// //         {/* Left Side - Report Info */}
// //         <Col md={7}>
// //           <Card className="mb-3">
// //             <Card.Header>Report Information</Card.Header>
// //             <Card.Body>
// //               <p><strong>Date:</strong> {FormatDate(report?.created_at)}</p>
// //               <p><strong>Reported By:</strong> {report?.reporter_name || "—"}</p>
// //               <p><strong>Location:</strong> {report?.location || "—"}</p>
// //               <p><strong>Description:</strong></p>
// //               <div
// //                 style={{
// //                   maxHeight: "200px",
// //                   overflowY: "auto",
// //                   background: "#f8f9fa",
// //                   padding: "8px",
// //                   borderRadius: "6px",
// //                 }}
// //               >
// //                 {report?.description || "—"}
// //               </div>

// //               {/* Editable Fields */}
// //               <Form.Group className="mt-3">
// //                 <Form.Label>Priority Level</Form.Label>
// //                 <Form.Select
// //                   name="priority"
// //                   value={formData.priority}
// //                   onChange={handleInputChange}
// //                 >
// //                   <option value="">Select priority</option>
// //                   <option value="Low">Low</option>
// //                   <option value="Medium">Medium</option>
// //                   <option value="High">High</option>
// //                   <option value="Urgent">Urgent</option>
// //                 </Form.Select>
// //               </Form.Group>

// //               <Form.Group className="mt-3">
// //                 <Form.Label>Report Type</Form.Label>
// //                 <Form.Select
// //                   name="report_type"
// //                   value={formData.report_type}
// //                   onChange={handleInputChange}
// //                 >
// //                   <option value="">Select type</option>
// //                   <option value="Incident">Incident</option>
// //                   <option value="Lost And Found">Lost And Found</option>
// //                   <option value="Maintenance">Maintenance</option>
// //                 </Form.Select>
// //               </Form.Group>

// //               {formData.report_type === "Maintenance" && (
// //                 <Form.Group className="mt-3">
// //                   <Form.Label>Category</Form.Label>
// //                   <Form.Select
// //                     name="category"
// //                     value={formData.category}
// //                     onChange={handleInputChange}
// //                   >
// //                     <option value="">Select category</option>
// //                     <option value="Electrical">Electrical</option>
// //                     <option value="Plumbing">Plumbing</option>
// //                     <option value="Cleaning">Cleaning</option>
// //                     <option value="General Repair">General Repair</option>
// //                     <option value="Others">Others</option>
// //                   </Form.Select>
// //                 </Form.Group>
// //               )}

// //               <div className="mt-3">
// //                 <Button
// //                   variant="success"
// //                   onClick={handleSave}
// //                   disabled={saving}
// //                 >
// //                   {saving ? "Saving..." : "Save Changes"}
// //                 </Button>
// //               </div>
// //             </Card.Body>
// //           </Card>
// //         </Col>

// //         {/* Right Side - Emails + Message Area */}
// //         <Col md={5}>
// //           <Card className="mb-3">
// //             <Card.Header>Email List</Card.Header>
// //             <ListGroup variant="flush">
// //               {emails.map((email) => (
// //                 <ListGroup.Item
// //                   key={email.id}
// //                   action
// //                   active={selectedEmail?.id === email.id}
// //                   onClick={() => setSelectedEmail(email)}
// //                 >
// //                   <div><strong>{email.subject}</strong></div>
// //                   <small>{email.from}</small>
// //                 </ListGroup.Item>
// //               ))}
// //             </ListGroup>
// //           </Card>

// //           {selectedEmail && (
// //             <Card>
// //               <Card.Header>Message</Card.Header>
// //               <Card.Body>
// //                 <h6>{selectedEmail.subject}</h6>
// //                 <p>
// //                   Example message body for <strong>{selectedEmail.from}</strong>.
// //                   (This can later be fetched dynamically from your API.)
// //                 </p>
// //                 <Form.Control
// //                   as="textarea"
// //                   rows={3}
// //                   placeholder="Reply here..."
// //                 />
// //                 <div className="mt-2">
// //                   <Button variant="primary">Send Reply</Button>
// //                 </div>
// //               </Card.Body>
// //             </Card>
// //           )}
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // }
// // export default ViewReportPage;

// import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Modal } from "react-bootstrap";
// import { useState, useEffect } from "react";
// import { useAuth } from "../../../AuthContext";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import FormatDate from "../../extra/DateFormat";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { io } from "socket.io-client";

// function ViewReportPage() {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { reportId } = location.state || {};
//     const [report, setReport] = useState([]);
//     const [successModal, setShowSuccessModal] = useState(false);
//     const [showError, setShowError] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [formData, setFormData] = useState({
//         priority: "",
//         status: "",
//         report_type: "",
//         location: "",
//         category: "",
//         acknowledged_by: user?.id,
//     });
//     const [saving, setSaving] = useState(false);

//     const fetchReport = async () =>{
//         try{
//             const reponse = await axios.get(`${import.meta.env.VITE_VIEW_REPORT_BY_ID}/${reportId}`);
//             setReport(reponse.data.reports[0]);
//         }catch(err){

//         }
//     }

//     useEffect(() =>{
//         fetchReport();
//         const socket = io(`${import.meta.env.VITE_API_URL}`);
//         socket.on('updateReports', () =>{
//             fetchReport();
//         });

//         return () =>{
//             socket.disconnect();
//         };
//     }, [reportId]);

//     // Dummy recipients
//     const [recipients] = useState([
//         { id: 1, name: "Admin Office", email: "admin@campus.edu" },
//         { id: 2, name: "Maintenance Dept", email: "maintenance@campus.edu" },
//         { id: 3, name: "Security Office", email: "security@campus.edu" },
//         { id: 4, name: "Student Affairs", email: "student.affairs@campus.edu" },
//     ]);

//     // Multiple recipients
//     const [selectedRecipients, setSelectedRecipients] = useState([]);

//     const [message, setMessage] = useState("");
//     const [sending, setSending] = useState(false);

//     const [searchTerm, setSearchTerm] = useState("");

//     const filteredRecipients = recipients.filter((r) =>
//         r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         r.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     useEffect(() => {
//         if (report) {
//             setFormData({
//                 priority: report.priority || "",
//                 status: report.status || "",
//                 report_type: report.report_type || "",
//                 location: report.location || "",
//                 category: report.category || "",
//                 acknowledged_by: user?.id,
//             });
//         }
//     }, [report]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSave = async () => {
//         if (!report?.id) return;
//         try {
//             setSaving(true);
//             const response = await axios.put(
//                 `${import.meta.env.VITE_UPDATE_REPORT}/${report.id}`,
//                 formData
//             );
//             if (response.status === 200) {
//                 setShowSuccessModal(true);

//             } else {
//                 setErrorMessage("Failed to save changes. Please try again.");
//             }
//         } catch (err) {
//             console.error(err);
//             // alert("Failed to update report");
//             setErrorMessage("Failed to save changes. Please try again.");
//             setShowError(true);
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleSendMessage = async () => {
//         if (selectedRecipients.length === 0 || !message.trim()) return;
//         try {
//             setSending(true);
//             selectedRecipients.forEach((recipient) => {
//                 console.log("Sending message:", {
//                     report_id: report.id,
//                     sender_id: user.id,
//                     recipient_id: recipient.id,
//                     message,
//                 });
//             });
//             alert(
//                 `Message sent to ${selectedRecipients.map((r) => r.name).join(", ")} (dummy send).`
//             );
//             setMessage("");
//             setSelectedRecipients([]);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setSending(false);
//         }
//     };


//     if (!report) {
//         return (
//             <Container className="mt-5 d-flex justify-content-center">
//                 <Card className="p-4 shadow-sm text-center" style={{ maxWidth: "500px", width: "100%" }}>
//                     <h4 className="mb-3">No Report Found</h4>
//                     <p className="text-muted mb-4">
//                         The report you are trying to view does not exist or may have been removed.
//                     </p>
//                     <Button variant="secondary" onClick={() => navigate("/reports")}>
//                         <i className="bi bi-arrow-left me-2"></i> Back to Reports
//                     </Button>
//                 </Card>
//             </Container>
//         );
//     }

//     return (
//         <Container fluid className="mt-3">
//             <Button
//                 variant="secondary"
//                 className="mb-3"
//                 onClick={() => navigate("/reports")}
//             >
//                 ← Back to Reports
//             </Button>
//             <Row>
//                 {/* Left Side - Report Info */}
//                 <Col md={7}>
//                     <Card className="mb-3">
//                         <Card.Header>Report Information</Card.Header>
//                         <Card.Body>
//                             <p><strong>Date:</strong> {FormatDate(report?.created_at)}</p>
//                             <p><strong>Reported By:</strong> {report?.reporter_name || "—"}</p>
//                             <p><strong>Location:</strong> {report?.location || "—"}</p>
//                             <p><strong>Description:</strong></p>

//                             <Card className="p-3">

//                                 {report?.description ? (
//                                     <div
//                                         dangerouslySetInnerHTML={{ __html: report.description }}
//                                         style={{ wordBreak: "break-word" }}
//                                     />
//                                 ) : (
//                                     <p className="mb-0 text-muted">No description provided.</p>
//                                 )}
//                             </Card>
//                             {/* Editable Fields */}
//                             <Form.Group className="mt-3">
//                                 <Form.Label>Priority Level</Form.Label>
//                                 <Form.Select
//                                     name="priority"
//                                     value={formData.priority}
//                                     onChange={handleInputChange}
//                                 >
//                                     <option value="">Select priority</option>
//                                     <option value="Low">Low</option>
//                                     <option value="Medium">Medium</option>
//                                     <option value="High">High</option>
//                                     <option value="Urgent">Urgent</option>
//                                 </Form.Select>
//                             </Form.Group>

//                             <Form.Group className="mt-3">
//                                 <Form.Label>Report Type</Form.Label>
//                                 <Form.Select
//                                     name="report_type"
//                                     value={formData.report_type}
//                                     onChange={handleInputChange}
//                                 >
//                                     <option value="">Select type</option>
//                                     <option value="Incident">Incident</option>
//                                     <option value="Lost And Found">Lost And Found</option>
//                                     <option value="Maintenance">Maintenance</option>
//                                 </Form.Select>
//                             </Form.Group>

//                             {formData.report_type === "Maintenance" && (
//                                 <Form.Group className="mt-3">
//                                     <Form.Label>Category</Form.Label>
//                                     <Form.Select
//                                         name="category"
//                                         value={formData.category}
//                                         onChange={handleInputChange}
//                                     >
//                                         <option value="">Select category</option>
//                                         <option value="Electrical">Electrical</option>
//                                         <option value="Plumbing">Plumbing</option>
//                                         <option value="Cleaning">Cleaning</option>
//                                         <option value="General Repair">General Repair</option>
//                                         <option value="Other">Others</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             )}

//                             <div className="mt-3">
//                                 <Button
//                                     variant="success"
//                                     onClick={handleSave}
//                                     disabled={saving}
//                                 >
//                                     {saving ? "Saving..." : "Save Changes"}
//                                 </Button>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>  
//                 {/* Right Side - Recipients + Message */}
//                 {/* Right Side - Recipients + Message */}
//                 <Col md={5}>
//                     <Card className="mb-3">
//                         <Card.Header>
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <span>Select Recipients</span>
//                             </div>
//                         </Card.Header>

//                         {/* Search Bar */}
//                         <div className="p-2">
//                             <Form.Control
//                                 type="text"
//                                 placeholder="Search recipients..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 size="sm"
//                             />
//                         </div>

//                         {/* Recipient List */}
//                         <ListGroup
//                             variant="flush"
//                             style={{ maxHeight: "250px", overflowY: "auto" }} // Thin + Scrollable
//                         >
//                             {filteredRecipients.length > 0 ? (
//                                 filteredRecipients.map((r) => (
//                                     <ListGroup.Item
//                                         key={r.id}
//                                         action
//                                         className="py-2 px-2" // makes items thinner
//                                         active={selectedRecipients.some((sr) => sr.id === r.id)}
//                                         onClick={() => {
//                                             setSelectedRecipients((prev) =>
//                                                 prev.some((sr) => sr.id === r.id)
//                                                     ? prev.filter((sr) => sr.id !== r.id)
//                                                     : [...prev, r]
//                                             );
//                                         }}
//                                     >
//                                         <div className="d-flex justify-content-between align-items-center">
//                                             <div>
//                                                 <strong>{r.name}</strong>
//                                                 <div style={{ fontSize: "0.8rem" }} className="text-muted">
//                                                     {r.email}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </ListGroup.Item>
//                                 ))
//                             ) : (
//                                 <ListGroup.Item className="text-muted text-center py-2">
//                                     No results found
//                                 </ListGroup.Item>
//                             )}
//                         </ListGroup>
//                     </Card>

//                     {selectedRecipients.length > 0 && (
//                         <Card>
//                             <Card.Header>
//                                 Message to{" "}
//                                 {selectedRecipients.map((r) => (
//                                     <Badge key={r.id} bg="info" className="me-1">
//                                         {r.name}
//                                     </Badge>
//                                 ))}
//                             </Card.Header>
//                             <Card.Body>
//                                 <ReactQuill
//                                     theme="snow"
//                                     value={message}
//                                     onChange={setMessage}
//                                     placeholder="Write your message..."
//                                     style={{ height: "150px", marginBottom: "50px" }}
//                                 />

//                                 <div className="mt-2">
//                                     <Button
//                                         variant="primary"
//                                         onClick={handleSendMessage}
//                                         disabled={sending}
//                                     >
//                                         {sending ? "Sending..." : "Send Message"}
//                                     </Button>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     )}
//                 </Col>

//                 {/* <Col md={5}>
//                     <Card className="mb-3">
//                         <Card.Header>Select Recipients</Card.Header>
//                         <ListGroup variant="flush">
//                             {recipients.map((r) => (
//                                 <ListGroup.Item
//                                     key={r.id}
//                                     action
//                                     active={selectedRecipients.some((sr) => sr.id === r.id)}
//                                     onClick={() => {
//                                         setSelectedRecipients((prev) => {
//                                             // toggle selection
//                                             if (prev.some((sr) => sr.id === r.id)) {
//                                                 return prev.filter((sr) => sr.id !== r.id);
//                                             } else {
//                                                 return [...prev, r];
//                                             }
//                                         });
//                                     }}
//                                 >
//                                     <div><strong>{r.name}</strong></div>
//                                     <small>{r.email}</small>
//                                 </ListGroup.Item>
//                             ))}
//                         </ListGroup>
//                     </Card>

//                     {selectedRecipients.length > 0 && (
//                         <Card>
//                             <Card.Header>
//                                 Message to{" "}
//                                 {selectedRecipients.map((r) => (
//                                     <Badge key={r.id} bg="info" className="me-1">
//                                         {r.name}
//                                     </Badge>
//                                 ))}
//                             </Card.Header>
//                             <Card.Body>
//                                 <ReactQuill
//                                     theme="snow"
//                                     value={message}
//                                     onChange={setMessage}
//                                     placeholder="Write your message..."
//                                     style={{ height: "150px", marginBottom: "50px" }}
//                                 />

//                                 <div className="mt-2">
//                                     <Button
//                                         variant="primary"
//                                         onClick={handleSendMessage}
//                                         disabled={sending}
//                                     >
//                                         {sending ? "Sending..." : "Send Message"}
//                                     </Button>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     )}
//                 </Col> */}

//                 <Modal showError={showError} onHide={() => setShowError(false)} centered animation={false}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>Notice</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <p>{errorMessage}</p>
//                     </Modal.Body>
//                     <Modal.Footer>
//                          <Button variant="primary" onClick={() => setShowError(false)}>OK</Button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={successModal} onHide={() =>setShowSuccessModal(false)}>
//                     <Modal.Header>
//                         <Modal.Title>
//                             Report Updated
//                         </Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <p>The report has been successfully updated.</p>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
//                             Close
//                         </Button>
//                     </Modal.Footer>
//                 </Modal>
//             </Row>
//         </Container>
//     );
// }

// export default ViewReportPage;

import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../../../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FormatDate from "../../extra/DateFormat";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { io } from "socket.io-client";
import isEqual from "lodash/isEqual";

function ViewReportPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { reportId } = location.state || {};
    const [report, setReport] = useState([]);
    const [successModal, setShowSuccessModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [originalFormData, setOriginalFormData] = useState(null);
    const [subject, setSubject] = useState("");
    const [emailSuccessModal, setEmailSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        priority: "",
        status: "",
        report_type: "",
        location: "",
        category: "",
        acknowledged_by: user?.id,
    });
    const [saving, setSaving] = useState(false);

    const fetchReport = async () => {
        try {

            const response = await axios.get(`${import.meta.env.VITE_VIEW_REPORT_BY_ID}/${reportId}`);
            const fetchedReport = response.data.reports[0];
            setReport(fetchedReport);
            const initialData = {
                priority: fetchedReport?.priority || "",
                status: fetchedReport?.status || "",
                report_type: fetchedReport?.report_type || "",
                location: fetchedReport?.location || "",
                category: fetchedReport?.category || "",
                acknowledged_by: user?.id,
            };

            setFormData(initialData);
            setOriginalFormData(initialData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReport();
        const socket = io(`${import.meta.env.VITE_API_URL}`);
        socket.on("updateReports", () => {
            fetchReport();
        });
        return () => {
            socket.disconnect();
        };
    }, [reportId]);

    // Dummy recipients for now
    const [recipients] = useState([
        { id: 1, name: "Admin Office", email: "goldengrape777@gmail.com" },
        { id: 2, name: "Maintenance Dept", email: "cabase.1324@gmail.com" },
        { id: 3, name: "Security Office", email: "gelocabase1324@gmail.comss" },
        { id: 4, name: "Student Affairs", email: "goldenlemon777@gmail.com" },
    ]);

    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRecipients = recipients.filter(
        (r) =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (report) {
            setFormData({
                priority: report.priority || "",
                status: report.status || "",
                report_type: report.report_type || "",
                location: report.location || "",
                category: report.category || "",
                acknowledged_by: user?.id,
            });
        }
    }, [report]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!report?.id) return;
        
        if (!formData.priority || !formData.report_type) {
            setErrorMessage("Please select both a priority level and a report type before saving");
            setShowError(true);
            return;
        } else if (!formData.priority) {
            setErrorMessage("Please select a priority level before saving");
            setShowError(true);
            return;
        } else if (!formData.report_type) {
            setErrorMessage("Please select a report type before saving");
            setShowError(true);
            return;
        }else if(formData.report_type === 'Maintenance' && !formData.category){
            setErrorMessage("Please select category before saving");
            setShowError(true);
            return;
        }
        try {
            setSaving(true);
            const response = await axios.put(
                `${import.meta.env.VITE_UPDATE_REPORT}/${report.id}`,
                formData
            );
            if (response.status === 200) {
                setShowSuccessModal(true);
            } else {
                setErrorMessage("Failed to save changes. Please try again.");
                setShowError(true);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to save changes. Please try again.");
            setShowError(true);
        } finally {
            setSaving(false);
        }
    };

    const sanitizeQuillContent = (html) => {
        return html.replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim();
    };
    const plainDesc = sanitizeQuillContent(message);

    const handleSendMessage = async () => {
        if (selectedRecipients.length === 0 || !message.trim()) return;

        if (!plainDesc) {
            setErrorMessage("Description cannot be empty.");
            setSending(false);
            return;
        }

        try {
            setSending(true);

            // Send one email per recipient
            for (const recipient of selectedRecipients) {
                await axios.post(`${import.meta.env.VITE_API_URL}/send-email`, {
                    to: recipient.email,
                    subject: subject || `Report #${report.id} - ${report.report_type}`,
                    message: message.replace(/<[^>]+>/g, ''),
                    html: message,
                });
            }
            setMessage("");
            setSelectedRecipients([]);
            setEmailSuccessModal(true);
        } catch (err) {
            console.error("Email sending error:", err);
            setErrorMessage("Failed to send email. Please try again.", err);
            setShowError(true);
        } finally {
            setSending(false);
        }
    };
    const hasChanges = !isEqual(formData, originalFormData);
    if (!report) {
        return (
            <Container className="mt-5 d-flex justify-content-center">
                <Card className="p-4 shadow-sm text-center" style={{ maxWidth: "500px", width: "100%" }}>
                    <h5 className="mb-3">No Report Found</h5>
                    <p className="text-muted small mb-4">
                        The report you are trying to view does not exist or may have been removed.
                    </p>
                    <Button variant="secondary" size="sm" onClick={() => navigate("/reports")}>
                        <i className="bi bi-arrow-left me-2"></i> Back to Reports
                    </Button>
                </Card>
            </Container>
        );
    }
    return (
        <Container fluid className="mt-3">
            <Button
                variant="secondary"
                size="sm"
                className="mb-3"
                onClick={() => navigate("/reports")}
            >
                ← Back to Reports
            </Button>
            <Row>
                {/* Left Side - Report Info */}
                <Col md={7}>
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="fw-semibold small">Report Information</Card.Header>
                        <Card.Body className="small">
                            <p className="mb-1">
                                <strong>Date:</strong>{" "}
                                <span className="text-muted">{FormatDate(report?.created_at)}</span>
                            </p>
                            <p className="mb-1">
                                <strong>Reported By:</strong>{" "}
                                <span className="text-muted">{report?.reporter_name || "—"}</span>
                            </p>
                            <p className="mb-1">
                                <strong>Location:</strong>{" "}
                                <span className="text-muted">{report?.location || "—"}</span>
                            </p>

                            <p className="fw-semibold mt-2">Description:</p>
                            <Card className="p-2 mb-2 small">
                                {report?.description ? (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: report.description }}
                                        style={{ wordBreak: "break-word", fontSize: "0.9rem" }}
                                        className="text-muted"
                                    />
                                ) : (
                                    <p className="mb-0 text-muted">No description provided.</p>
                                )}
                            </Card>

                            {/* Editable Fields */}
                            <Form.Group className="mt-2">
                                <Form.Label className="small fw-semibold">Priority Level</Form.Label>
                                <Form.Select
                                    size="sm"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select priority</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mt-2">
                                <Form.Label className="small fw-semibold">Report Type</Form.Label>
                                <Form.Select
                                    size="sm"
                                    name="report_type"
                                    value={formData.report_type}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select type</option>
                                    <option value="Incident">Incident</option>
                                    <option value="Lost And Found">Lost And Found</option>
                                    <option value="Maintenance">Maintenance</option>
                                </Form.Select>
                            </Form.Group>

                            {formData.report_type === "Maintenance" && (
                                <Form.Group className="mt-2">
                                    <Form.Label className="small fw-semibold">Category</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select category</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Cleaning">Cleaning</option>
                                        <option value="General Repair">General Repair</option>
                                        <option value="Others">Others</option>
                                    </Form.Select>
                                </Form.Group>
                            )}

                            <div className="mt-3">
                                <Button variant="success" size="sm" onClick={handleSave} disabled={saving || !hasChanges}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Side - Recipients + Message */}
                <Col md={5}>
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="fw-semibold small">Select Recipients</Card.Header>
                        <div className="p-2">
                            <Form.Control
                                type="text"
                                placeholder="Search recipients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="sm"
                            />
                        </div>
                        <ListGroup variant="flush" style={{ maxHeight: "250px", overflowY: "auto" }}>
                        {filteredRecipients.length > 0 ? (
                            filteredRecipients.map((r) => {
                            const isActive = selectedRecipients.some((sr) => sr.id === r.id);
                            return (
                                <ListGroup.Item
                                key={r.id}
                                action
                                className={`py-1 px-2 small ${isActive ? "active-recipient" : ""}`}
                                onClick={() => {
                                    setSelectedRecipients((prev) =>
                                    prev.some((sr) => sr.id === r.id)
                                        ? prev.filter((sr) => sr.id !== r.id)
                                        : [...prev, r]
                                    );
                                }}
                                >
                                <div>
                                    <strong>{r.name}</strong>
                                    <div className="text-muted small">{r.email}</div>
                                </div>
                                </ListGroup.Item>
                            );
                            })
                        ) : (
                            <ListGroup.Item className="text-muted text-center py-2 small">
                            No results found
                            </ListGroup.Item>
                        )}
                        </ListGroup>

                        {/* <ListGroup variant="flush" style={{ maxHeight: "250px", overflowY: "auto" }}>
                            {filteredRecipients.length > 0 ? (
                                filteredRecipients.map((r) => (
                                    <ListGroup.Item
                                        key={r.id}
                                        action
                                        className="py-1 px-2 small"
                                        active={selectedRecipients.some((sr) => sr.id === r.id)}
                                        onClick={() => {
                                            setSelectedRecipients((prev) =>
                                                prev.some((sr) => sr.id === r.id)
                                                    ? prev.filter((sr) => sr.id !== r.id)
                                                    : [...prev, r]
                                            );
                                        }}
                                    >
                                        <div>
                                            <strong>{r.name}</strong>
                                            <div className="text-muted small">{r.email}</div>
                                        </div>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item className="text-muted text-center py-2 small">
                                    No results found
                                </ListGroup.Item>
                            )}
                        </ListGroup> */}
                    </Card>

                    {selectedRecipients.length > 0 && (
                        <Card className="shadow-sm">
                            <Card.Header className="small">
                                Message to{" "}
                                {selectedRecipients.map((r) => (
                                    <Badge key={r.id} bg="info" className="me-1 small">
                                        {r.name}
                                    </Badge>
                                ))}
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-2">
                                    <Form.Label className="small fw-semibold">Email Subject</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder='Subject'
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </Form.Group>

                                <ReactQuill
                                    theme="snow"
                                    value={message}
                                    onChange={setMessage}
                                    placeholder="Write your message..."
                                    style={{ height: "120px", marginBottom: "60px", fontSize: "0.9rem" }}
                                />
                                <div className="mt-2">
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleSendMessage}
                                    disabled={
                                        sending ||
                                        selectedRecipients.length === 0 ||
                                        !subject.trim() ||
                                        !plainDesc
                                    }
                                >
                                    {sending ? "Sending..." : "Send Message"}
                                </Button>
                            </Card.Footer>
                        </Card>
                    )}
                </Col>
                {/* Email Success Modal */}
                <Modal show={emailSuccessModal} onHide={() => setShowSuccessModal(false)}>
                    <Modal.Header>
                        <Modal.Title className="fw-bold fs-6">Email Sent</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="small">Email successfully sent.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setEmailSuccessModal(false)}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Error Modal */}
                <Modal show={showError} onHide={() => setShowError(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold fs-6">Notice</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="small">{errorMessage}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" size="sm" onClick={() => setShowError(false)}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={successModal} onHide={() => setShowSuccessModal(false)}>
                    <Modal.Header>
                        <Modal.Title className="fs-6 fw-bold">Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="small">Action completed successfully.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowSuccessModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Row>
        </Container>
    );
}

export default ViewReportPage;
