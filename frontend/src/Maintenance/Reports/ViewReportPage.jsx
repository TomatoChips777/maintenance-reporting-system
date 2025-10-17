// // import { Container, Card, Button, Row, Col, Form, Image, ListGroup, Accordion, Spinner } from "react-bootstrap";
// // import FormatDate from "../../extra/DateFormat";
// // import { useState, useEffect, useMemo } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import axios from "axios";
// // import { useAuth } from "../../../AuthContext";


// // function ViewReportPage() {
// //   const { user } = useAuth();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { report, staff } = location.state || {};
// //   const [newRemark, setNewRemark] = useState('');
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [saveLoading, setSaveLoading] = useState(false);
// //   const [formData, setFormData] = useState({
// //     priority: "",
// //     status: "",
// //     category: "",
// //     location: "",
// //     schedule_date: "",
// //     assigned_staff: [],
// //     updated_by: user?.id,
// //   });

// //   const [remarks, setRemarks] = useState([]);
// //   const [searchStaff, setSearchStaff] = useState("");

// //   useEffect(() => {
// //     if (report) {
// //       setFormData({
// //         priority: report.priority || "",
// //         status: report.status || "",
// //         category: report.category || "",
// //         location: report.location || "",
// //         schedule_date: report.schedule_date || "",
// //         assigned_staff: report.assigned_staff
// //           ? report.assigned_staff.split(",").map(String)
// //           : [],
// //         updated_by: user?.id,

// //       });
// //       fetchRemarks(report.id);
// //     }
// //   }, [report]);

// //   const fetchRemarks = async (reportId) => {
// //     try {
// //       const res = await axios.get(
// //         `${import.meta.env.VITE_GET_REPORT_REMARKS}/${reportId}`
// //       );
// //       if (res.data.success) {
// //         setRemarks(res.data.remarks || []);
// //       }
// //     } catch (err) {
// //       console.error("Failed to fetch remarks:", err);
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   };

// //   const filterStaff = useMemo(() => {
// //     return (
// //       staff?.filter((s) => {
// //         const matchesSearch =
// //           s.name?.toLowerCase().includes(searchStaff.toLowerCase()) ||
// //           s.role?.toLowerCase().includes(searchStaff.toLowerCase());
// //         return matchesSearch;
// //       }) || []
// //     );
// //   }, [staff, searchStaff]);
// //   // const handleSave = async () => {
// //   //   if (!report?.id) return;
// //   //   try {
// //   //     const payload = {
// //   //       ...formData,
// //   //       assigned_staff: formData.assigned_staff.join(","),
// //   //     };
// //   //     await axios.put(
// //   //       `${import.meta.env.VITE_UPDATE_MAINTENANCE_REPORT}/${report.id}`,
// //   //       payload
// //   //     );

// //   //     alert("Report updated successfully!");

// //   //     // Re-fetch remarks and updated report so UI refreshes
// //   //     fetchRemarks(report.id);

// //   //     // If you want to update the report details on-screen:
// //   //     setFormData((prev) => ({
// //   //       ...prev,
// //   //       ...payload,
// //   //     }));

// //   //   } catch (err) {
// //   //     alert("Error saving report. Please try again.");
// //   //   }
// //   // };

// //   // const handleSave = async () => {
// //   //   if (!report?.id) return;
// //   //   try {
// //   //     const payload = {
// //   //       ...formData,
// //   //       assigned_staff: formData.assigned_staff.join(","),
// //   //     };
// //   //     await axios.put(
// //   //       `${import.meta.env.VITE_UPDATE_MAINTENANCE_REPORT}/${report.id}`,
// //   //       payload
// //   //     );
// //   //     alert("Report updated successfully!");
// //   //     navigate("/reports");
// //   //   } catch (err) {
// //   //     alert("Error saving report. Please try again.");
// //   //   }
// //   // };
// //   const handleProgressRemarks = async (e) => {
// //     e.preventDefault();
// //     setSaveLoading(true);
// //     if (!newRemark.trim()) {
// //       setErrorMessage("Remark cannot be empty.");
// //       setSaveLoading(false);
// //       return;
// //     }


// //     try {
// //       await axios.post(
// //         `${import.meta.env.VITE_ADD_REPORT_REMARKS}/${report.id}`,
// //         {
// //           remark: newRemark,
// //           action: formData.status,
// //           updated_by: user?.id,
// //         }
// //       );

// //       setRemarks((prev) => [
// //         {
// //           remark: newRemark,
// //           action: formData.status,
// //           updated_by: user?.name || 'System',
// //           created_at: new Date().toISOString(),
// //         },
// //         ...prev,
// //       ]);
// //       setNewRemark("");
// //     } catch (err) {
// //       console.error("Failed to add remark:", err);
// //     } finally {
// //       setSaveLoading(false);
// //     }
// //   };

// //   const handleSave = async () => {
// //     if (!report?.id) return;
// //     try {
// //       const payload = {
// //         ...formData,
// //         assigned_staff: formData.assigned_staff.join(","),
// //       };

// //       await axios.put(
// //         `${import.meta.env.VITE_UPDATE_MAINTENANCE_REPORT}/${report.id}`,
// //         payload
// //       );

// //       const updatedReportRes = await axios.get(
// //         `${import.meta.env.VITE_GET_REPORT}/${report.id}`
// //       );

// //       if (updatedReportRes.data.success) {
// //         const updatedReport = updatedReportRes.data.report;
// //         setFormData({
// //           priority: updatedReport.priority || "",
// //           status: updatedReport.status || "",
// //           category: updatedReport.category || "",
// //           location: updatedReport.location || "",
// //           schedule_date: updatedReport.schedule_date || "",
// //           assigned_staff: updatedReport.assigned_staff
// //             ? updatedReport.assigned_staff.split(",").map(String)
// //             : [],
// //           updated_by: user?.id,
// //         });
// //       }

// //       // Also refresh remarks after update
// //       fetchRemarks(report.id);

// //       alert("Report updated successfully!");
// //     } catch (err) {
// //       alert("Error saving report. Please try again.");
// //     }
// //   };
// //   if (!report) {
// //     return (
// //       <Container className="mt-5 d-flex justify-content-center">
// //         <Card className="p-4 shadow-sm text-center" style={{ maxWidth: "500px", width: "100%" }}>
// //           <h4 className="mb-3">No Report Found</h4>
// //           <p className="text-muted mb-4">
// //             The report you are trying to view does not exist or may have been removed.
// //           </p>
// //           <Button variant="secondary" onClick={() => navigate("/reports")}>
// //             <i className="bi bi-arrow-left me-2"></i> Back to Reports
// //           </Button>
// //         </Card>
// //       </Container>
// //     );
// //   }


// //   return (
// //     <Container fluid className="p-3">
// //       <Button
// //         variant="secondary"
// //         className="mb-3"
// //         onClick={() => navigate("/reports")}
// //       >
// //         ← Back to Reports
// //       </Button>

// //       <Row>
// //         {/* LEFT SIDE – Report details */}
// //         <Col md={7}>
// //           <Card className="p-3 shadow-sm">
// //             <h4 className="mb-3">Viewing Report</h4>

// //             {report?.image_path && (
// //               <div className="mb-3 text-center">
// //                 <Image
// //                   src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
// //                   alt="Report"
// //                   fluid
// //                   style={{
// //                     maxHeight: "350px",
// //                     objectFit: "contain",
// //                     borderRadius: "8px",
// //                   }}
// //                 />
// //               </div>
// //             )}

// //             <Row className="mb-3">
// //               <Col sm={4}>
// //                 <strong>Date:</strong>
// //               </Col>
// //               <Col> <u>{FormatDate(report?.created_at)}</u></Col>
// //             </Row>
// //             <Row className="mb-3">
// //               <Col sm={4}>
// //                 <strong>Location:</strong>
// //               </Col>
// //               <Col><u>{report?.location || "—"}</u></Col>
// //             </Row>

// //             <div className="mb-3">
// //               <strong>Description:</strong>
// //               <Card className="p-2">
// //                 {report?.description ? (
// //                   <div
// //                     dangerouslySetInnerHTML={{ __html: report.description }}
// //                     style={{ wordBreak: "break-word" }}
// //                   />
// //                 ) : (
// //                   <p className="mb-0 text-muted">No description provided.</p>
// //                 )}
// //               </Card>
// //             </div>

// //             {/* Editable Fields */}
// //             <Row className="mb-3">
// //               <Col md={6}>
// //                 <Form.Group>
// //                   <Form.Label>
// //                     <strong>Priority</strong>
// //                   </Form.Label>
// //                   <Form.Select
// //                     name="priority"
// //                     value={formData.priority}
// //                     onChange={handleInputChange}
// //                   >
// //                     <option value="">Select priority</option>
// //                     <option value="Low">Low</option>
// //                     <option value="Medium">Medium</option>
// //                     <option value="High">High</option>
// //                     <option value="Urgent">Urgent</option>
// //                   </Form.Select>
// //                 </Form.Group>
// //               </Col>
// //               <Col md={6}>
// //                 <Form.Group>
// //                   <Form.Label>
// //                     <strong>Category</strong>
// //                   </Form.Label>
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
// //                   </Form.Select>
// //                 </Form.Group>
// //               </Col>
// //             </Row>

// //             <Row className="mb-3">
// //               <Col md={6}>
// //                 <Form.Group>
// //                   <Form.Label>
// //                     <strong>Status</strong>
// //                   </Form.Label>
// //                   <Form.Select
// //                     name="status"
// //                     value={formData.status}
// //                     onChange={handleInputChange}
// //                   >
// //                     <option value="">Select status</option>
// //                     <option value="Pending">Pending</option>
// //                     <option value="In Progress">In Progress</option>
// //                     <option value="Resolved">Resolved</option>
// //                   </Form.Select>
// //                 </Form.Group>
// //               </Col>
// //               <Col md={6}>
// //                 <Form.Group>
// //                   <Form.Label>
// //                     <strong>Set Schedule</strong>
// //                   </Form.Label>
// //                   <Form.Control
// //                     type="date"
// //                     name="schedule_date"
// //                     value={formData.schedule_date}
// //                     onChange={handleInputChange}
// //                   />
// //                 </Form.Group>
// //               </Col>
// //             </Row>

// //             {/* Staff Assignment */}
// //             <Row>
// //               <Col>
// //                 <Form.Group>
// //                   <Form.Label>
// //                     <strong>Assign Staff</strong>
// //                   </Form.Label>
// //                   <Form.Control
// //                     type="text"
// //                     placeholder="Search staff..."
// //                     value={searchStaff}
// //                     onChange={(e) => setSearchStaff(e.target.value)}
// //                     className="mb-2"
// //                   />
// //                   <div
// //                     style={{
// //                       maxHeight: "200px",
// //                       overflowY: "auto",
// //                       border: "1px solid #dee2e6",
// //                       padding: "6px",
// //                       background: "#fff",
// //                     }}
// //                   >
// //                     {filterStaff.length > 0 ? (
// //                       filterStaff.map((s) => (
// //                         <div
// //                           key={s.id}
// //                           className="d-flex justify-content-between align-items-center border-bottom py-2"
// //                         >
// //                           <Form.Check
// //                             type="checkbox"
// //                             id={`staff-${s.id}`}
// //                             value={s.id}
// //                             checked={formData.assigned_staff.includes(String(s.id))}
// //                             onChange={(e) => {
// //                               const { checked, value } = e.target;
// //                               setFormData((prev) => ({
// //                                 ...prev,
// //                                 assigned_staff: checked
// //                                   ? [...prev.assigned_staff, value]
// //                                   : prev.assigned_staff.filter((id) => id !== value),
// //                               }));
// //                             }}
// //                             label={s.name}
// //                             className="me-2 custom-checkbox"
// //                           />
// //                           <small className="text-muted">{s.role}</small>
// //                         </div>
// //                       ))
// //                     ) : (
// //                       <p className="text-muted text-center mb-0">
// //                         No staff available
// //                       </p>
// //                     )}
// //                   </div>
// //                 </Form.Group>
// //               </Col>
// //             </Row>

// //             <div className="mt-3 d-flex justify-content-end">
// //               <Button variant="success" onClick={handleSave}>
// //                 Save Changes
// //               </Button>
// //             </div>
// //           </Card>
// //         </Col>
// //         {/* RIGHT SIDE – Remarks / History */}
// //         <Col md={5}>
// //           <Card className="p-3 shadow-sm h-100">
// //             <h5 className="mb-3">Progress & Remarks</h5>

// //             {/* Add new remark */}
// //             <Form className="mt-3" onSubmit={handleProgressRemarks}>
// //               <Form.Group>
// //                 <Form.Control
// //                   className={`${errorMessage ? 'is-invalid' : ''}`}
// //                   as="textarea"
// //                   rows={4}
// //                   placeholder="Type your remark here..."
// //                   value={newRemark}
// //                   onChange={(e) => { setNewRemark(e.target.value.trimStart()); setErrorMessage("") }}
// //                 />
// //                 {errorMessage && (
// //                   <Form.Control.Feedback type="invalid">
// //                     {errorMessage}
// //                   </Form.Control.Feedback>
// //                 )}
// //               </Form.Group>
// //               <div className="d-flex justify-content-end mt-2">
// //                 <Button variant="primary" type="submit" size="sm" disabled={saveLoading}>
// //                   {/* Add Remark */}
// //                   {saveLoading ? <Spinner animation="border" size="sm" /> : 'Add Remark'}
// //                 </Button>
// //               </div>
// //             </Form>

// //             {/* Remarks history with Accordion */}
// //             <div style={{ maxHeight: "400px", overflowY: "auto" }} className="mt-3">
// //               {remarks.length > 0 ? (
// //                 <Accordion alwaysOpen>
// //                   {remarks.map((r, idx) => (
// //                     <Accordion.Item eventKey={idx.toString()} key={idx}>
// //                       <Accordion.Header>
// //                         <div className="d-flex flex-column w-100">
// //                           <span><strong>{r.action || "Update"}</strong></span>
// //                           <small className="text-muted">{FormatDate(r.created_at)}</small>
// //                         </div>
// //                       </Accordion.Header>
// //                       <Accordion.Body>
// //                         <p className="mb-1"><small className="text-muted">{r.remark || "—"}</small></p>
// //                         <p><small className="text-muted">by {r.updated_by || "System"}</small></p>
// //                       </Accordion.Body>
// //                     </Accordion.Item>
// //                   ))}
// //                 </Accordion>
// //               ) : (
// //                 <p className="text-muted">No updates yet.</p>
// //               )}
// //             </div>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // }
// // export default ViewReportPage;



// import { Container, Card, Button, Row, Col, Form, Image, ListGroup, Accordion, Spinner, Modal } from "react-bootstrap";
// import FormatDate from "../../extra/DateFormat";
// import { useState, useEffect, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../../../AuthContext";
// import isEqual from "lodash/isEqual"; // install lodash if not yet: npm install lodash
// import { io } from "socket.io-client";
// function ViewReportPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [report, setReport] = useState([]);
//   const { maintenance_id, staff } = location.state || {};
//   const [newRemark, setNewRemark] = useState('');
//   const [errorMessage, setErrorMessage] = useState("");
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [successModal, setSuccessModal] = useState(false);
//   const [formData, setFormData] = useState(null);
//   const [initialData, setInitialData] = useState(null); // snapshot of original data
//   const [remarks, setRemarks] = useState([]);
//   const [searchStaff, setSearchStaff] = useState("");

//   const fetchReport = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_VIEW_MAINTENANCE_REPORT_BY_ID}/${maintenance_id}`);
//       setReport(response.data.reports[0]);
//     } catch (err) {
//     }
//   }
//   // Fetch report once
//   useEffect(() => {
//     fetchReport();
//     const socket = io(`${import.meta.env.VITE_API_URL}`);
//     socket.on('updateReports', () => {
//       fetchReport();
//     });

//     return () => {
//       socket.disconnect();
//     };

//   }, [maintenance_id]);

//   // When report is fetched, prepare formData
//   useEffect(() => {
//     if (report?.id) {
//       const formatted = {
//         priority: report.priority || "",
//         status: report.status || "",
//         category: report.category || "",
//         location: report.location || "",
//         schedule_date: report.schedule_date || "",
//         assigned_staff: report.assigned_staff
//           ? report.assigned_staff.split(",").map(String).sort() //  normalize
//           : [],
//         updated_by: user?.id,
//       };
//       setFormData(formatted);
//       setInitialData(formatted); // snapshot
//       fetchRemarks(report.id);
//     }
//   }, [report, user]);

//   // Check input if change to enable the save changes button
//   const isChanged = useMemo(() => {
//     if (!formData || !initialData) return false;

//     const normalizedForm = {
//       ...formData,
//       assigned_staff: [...formData.assigned_staff].sort(),
//     };
//     const normalizedInitial = {
//       ...initialData,
//       assigned_staff: [...initialData.assigned_staff].sort(),
//     };

//     return !isEqual(normalizedForm, normalizedInitial);
//   }, [formData, initialData]);

//   // Fetch progress remarks/logs. 
//   const fetchRemarks = async (reportId) => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_GET_REPORT_REMARKS}/${reportId}`
//       );
//       if (res.data.success) {
//         setRemarks(res.data.remarks || []);
//       }
//     } catch (err) {
//       console.error("Failed to fetch remarks:", err);
//     }
//   };
//  // input change hooks
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const filterStaff = useMemo(() => {
//     return (
//       staff?.filter((s) => {
//         const matchesSearch =
//           s.name?.toLowerCase().includes(searchStaff.toLowerCase()) ||
//           s.role?.toLowerCase().includes(searchStaff.toLowerCase());
//         return matchesSearch;
//       }) || []
//     );
//   }, [staff, searchStaff]);

//   const handleProgressRemarks = async (e) => {
//     e.preventDefault();
//     setSaveLoading(true);
//     if (!newRemark.trim()) {
//       setErrorMessage("Remark cannot be empty.");
//       setSaveLoading(false);
//       return;
//     }

//     try {
//       await axios.post(
//         `${import.meta.env.VITE_ADD_REPORT_REMARKS}/${report.id}`,
//         {
//           remark: newRemark,
//           action: formData.status,
//           updated_by: user?.id,
//         }
//       );

//       setRemarks((prev) => [
//         {
//           remark: newRemark,
//           action: formData.status,
//           updated_by: user?.name || 'System',
//           created_at: new Date().toISOString(),
//         },
//         ...prev,
//       ]);
//       setSuccessModal(true);
//       setNewRemark("");
//     } catch (err) {
//       console.error("Failed to add remark:", err);
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!report?.id) return;
//     try {
//       const payload = {
//         ...formData,
//         assigned_staff: formData.assigned_staff.join(","),
//       };
//       await axios.put(
//         `${import.meta.env.VITE_UPDATE_MAINTENANCE_REPORT}/${report.id}`,
//         payload
//       );
//       setSuccessModal(true);    
//     } catch (err) {
//       alert("Error saving report. Please try again.");
//     }
//   };

//   if (!report || !formData) {
//     return (
//       <Container className="mt-5 d-flex justify-content-center">
//         <Card className="p-4 shadow-sm text-center" style={{ maxWidth: "500px", width: "100%" }}>
//           <h4 className="mb-3">No Report Found</h4>
//           <p className="text-muted mb-4">
//             The report you are trying to view does not exist or may have been removed.
//           </p>
//           <Button variant="secondary" onClick={() => navigate("/reports")}>
//             <i className="bi bi-arrow-left me-2"></i> Back to Reports
//           </Button>
//         </Card>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="p-3">
//       <Button
//         variant="secondary"
//         className="mb-3"
//         onClick={() => navigate("/reports")}
//       >
//         ← Back to Reports
//       </Button>

//       <Row>
//         <Col md={7}>
//           <Card className="p-3 shadow-sm">
//             <h4 className="mb-3">Viewing Report</h4>

//             {report?.image_path && (
//               <div className="mb-3 text-center">
//                 <Image
//                   src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
//                   alt="Report"
//                   fluid
//                   style={{
//                     maxHeight: "350px",
//                     objectFit: "contain",
//                     borderRadius: "8px",
//                   }}
//                 />
//               </div>
//             )}

//             <Row className="mb-3">
//               <Col sm={4}>
//                 <strong>Date:</strong>
//               </Col>
//               <Col> <u>{FormatDate(report?.created_at)}</u></Col>
//             </Row>
//             <Row className="mb-3">
//               <Col sm={4}>
//                 <strong>Location:</strong>
//               </Col>
//               <Col><u>{report?.location || "—"}</u></Col>
//             </Row>

//             <div className="mb-3">
//               <strong>Description:</strong>
//               <Card className="p-2">
//                 {report?.description ? (
//                   <div
//                     dangerouslySetInnerHTML={{ __html: report.description }}
//                     style={{ wordBreak: "break-word" }}
//                   />
//                 ) : (
//                   <p className="mb-0 text-muted">No description provided.</p>
//                 )}
//               </Card>
//             </div>

//             {/* Editable Fields */}
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>
//                     <strong>Priority</strong>
//                   </Form.Label>
//                   <Form.Select
//                     name="priority"
//                     value={formData.priority}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select priority</option>
//                     <option value="Low">Low</option>
//                     <option value="Medium">Medium</option>
//                     <option value="High">High</option>
//                     <option value="Urgent">Urgent</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>
//                     <strong>Category</strong>
//                   </Form.Label>
//                   <Form.Select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select category</option>
//                     <option value="Electrical">Electrical</option>
//                     <option value="Plumbing">Plumbing</option>
//                     <option value="Cleaning">Cleaning</option>
//                     <option value="General Repair">General Repair</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>
//                     <strong>Status</strong>
//                   </Form.Label>
//                   <Form.Select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select status</option>
//                     <option value="Pending">Pending</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Resolved">Resolved</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>
//                     <strong>Set Schedule</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="schedule_date"
//                     value={formData.schedule_date}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             {/* Staff Assignment */}
//             <Row>
//               <Col>
//                 <Form.Group>
//                   <Form.Label>
//                     <strong>Assign Staff</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Search staff..."
//                     value={searchStaff}
//                     onChange={(e) => setSearchStaff(e.target.value)}
//                     className="mb-2"
//                   />
//                   <div
//                     style={{
//                       maxHeight: "200px",
//                       overflowY: "auto",
//                       border: "1px solid #dee2e6",
//                       padding: "6px",
//                       background: "#fff",
//                     }}
//                   >
//                     {filterStaff.length > 0 ? (
//                       filterStaff.map((s) => (
//                         <div
//                           key={s.id}
//                           className="d-flex justify-content-between align-items-center border-bottom py-2"
//                         >
//                           <Form.Check
//                             type="checkbox"
//                             id={`staff-${s.id}`}
//                             value={s.id}
//                             checked={formData.assigned_staff.includes(String(s.id))}
//                             onChange={(e) => {
//                               const { checked, value } = e.target;
//                               setFormData((prev) => ({
//                                 ...prev,
//                                 assigned_staff: checked
//                                   ? [...prev.assigned_staff, value]
//                                   : prev.assigned_staff.filter((id) => id !== value),
//                               }));
//                             }}
//                             label={s.name}
//                             className="me-2 custom-checkbox"
//                           />
//                           <small className="text-muted">{s.role}</small>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-muted text-center mb-0">
//                         No staff available
//                       </p>
//                     )}
//                   </div>
//                 </Form.Group>
//               </Col>
//             </Row>
//             <div className="mt-3 d-flex justify-content-end">
//               <Button
//                 variant="success"
//                 onClick={handleSave}
//                 disabled={!isChanged}
//                 title={!isChanged ? "No changes to save" : ""}
//               >
//                 Save Changes
//               </Button>
//             </div>
//           </Card>
//         </Col>

//         {/* RIGHT SIDE remains unchanged */}
//         <Col md={5}>
//           <Card className="p-3 shadow-sm h-100">
//             <h5 className="mb-3">Progress & Remarks</h5>

//             {/* Add new remark */}
//             <Form className="mt-3" onSubmit={handleProgressRemarks}>
//               <Form.Group>
//                 <Form.Control
//                   className={`${errorMessage ? 'is-invalid' : ''}`}
//                   as="textarea"
//                   rows={4}
//                   placeholder="Type your remark here..."
//                   value={newRemark}
//                   onChange={(e) => { setNewRemark(e.target.value.trimStart()); setErrorMessage("") }}
//                 />
//                 {errorMessage && (
//                   <Form.Control.Feedback type="invalid">
//                     {errorMessage}
//                   </Form.Control.Feedback>
//                 )}
//               </Form.Group>
//               <div className="d-flex justify-content-end mt-2">
//                 <Button variant="primary" type="submit" size="sm" disabled={saveLoading}>
//                   {/* Add Remark */}
//                   {saveLoading ? <Spinner animation="border" size="sm" /> : 'Add Remark'}
//                 </Button>
//               </div>
//             </Form>

//             {/* Remarks history with Accordion */}
//             <div style={{ maxHeight: "400px", overflowY: "auto" }} className="mt-3">
//               {remarks.length > 0 ? (
//                 <Accordion alwaysOpen>
//                   {remarks.map((r, idx) => (
//                     <Accordion.Item eventKey={idx.toString()} key={idx}>
//                       <Accordion.Header>
//                         <div className="d-flex flex-column w-100">
//                           <span><strong>{r.action || "Update"}</strong></span>
//                           <small className="text-muted">{FormatDate(r.created_at)}</small>
//                         </div>
//                       </Accordion.Header>
//                       <Accordion.Body>
//                         <p className="mb-1"><small className="text-muted">{r.remark || "—"}</small></p>
//                         <p><small className="text-muted">by {r.updated_by || "System"}</small></p>
//                       </Accordion.Body>
//                     </Accordion.Item>
//                   ))}
//                 </Accordion>
//               ) : (
//                 <p className="text-muted">No updates yet.</p>
//               )}
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       <Modal show={successModal} onHide={() => setSuccessModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Report Update</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>The report has been successfully updated</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setSuccessModal(false)}
//           >Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// export default ViewReportPage;


import { Container, Card, Button, Row, Col, Form, Image, Accordion, Spinner, Modal } from "react-bootstrap";
import FormatDate from "../../extra/DateFormat";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../AuthContext";
import isEqual from "lodash/isEqual";
import { io } from "socket.io-client";

function ViewReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState([]);
  const { maintenance_id, staff } = location.state || {};
  const [newRemark, setNewRemark] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [searchStaff, setSearchStaff] = useState("");

  // Fetch report
  const fetchReport = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VIEW_MAINTENANCE_REPORT_BY_ID}/${maintenance_id}`);
      setReport(response.data.reports[0]);
    } catch { }
  };

  useEffect(() => {
    fetchReport();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on("updateReports", fetchReport);
    return () => socket.disconnect();
  }, [maintenance_id]);

  // Prepare form data
  useEffect(() => {
    if (report?.id) {
      const formatted = {
        priority: report.priority || "",
        status: report.status || "",
        category: report.category || "",
        location: report.location || "",
        schedule_date: report.schedule_date || "",
        assigned_staff: report.assigned_staff ? report.assigned_staff.split(",").map(String).sort() : [],
        updated_by: user?.id,
      };
      setFormData(formatted);
      setInitialData(formatted);
      fetchRemarks(report.id);
    }
  }, [report, user]);

  // Detect changes
  const isChanged = useMemo(() => {
    if (!formData || !initialData) return false;
    return !isEqual(
      { ...formData, assigned_staff: [...formData.assigned_staff].sort() },
      { ...initialData, assigned_staff: [...initialData.assigned_staff].sort() }
    );
  }, [formData, initialData]);

  // Fetch remarks
  const fetchRemarks = async (reportId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_GET_REPORT_REMARKS}/${reportId}`);
      if (res.data.success) setRemarks(res.data.remarks || []);
    } catch (err) {
      console.error("Failed to fetch remamrks:", err);
    }
  };

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filterStaff = useMemo(() => {
    return staff?.filter(
      (s) =>
        s.name?.toLowerCase().includes(searchStaff.toLowerCase()) ||
        s.role?.toLowerCase().includes(searchStaff.toLowerCase())
    ) || [];
  }, [staff, searchStaff]);

  const handleProgressRemarks = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    if (!newRemark.trim()) {
      setErrorMessage("Remark cannot be empty.");
      setSaveLoading(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_ADD_REPORT_REMARKS}/${report.id}`, {
        remark: newRemark,
        action: formData.status,
        updated_by: user?.id,
      });

      setRemarks((prev) => [
        { remark: newRemark, action: formData.status, updated_by: user?.name || "System", created_at: new Date().toISOString() },
        ...prev,
      ]);
      setSuccessModal(true);
      setNewRemark("");
    } catch (err) {
      console.error("Failed to add remark:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSave = async () => {
    if (!report?.id) return;
    try {
      await axios.put(`${import.meta.env.VITE_UPDATE_MAINTENANCE_REPORT}/${report.id}`, {
        ...formData,
        assigned_staff: formData.assigned_staff.join(","),
      });
      setSuccessModal(true);
    } catch {
      alert("Error saving report. Please try again.");
    }
  };

  if (!report || !formData) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Card className="p-4 shadow-sm text-center" style={{ maxWidth: "500px", width: "100%" }}>
          <h5 className="fw-bold mb-3">No Report Found</h5>
          <p className="text-muted small mb-4">This report does not exist or may have been removed.</p>
          <Button variant="secondary" onClick={() => navigate("/reports")}>
            <i className="bi bi-arrow-left me-2"></i> Back to Reports
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0 ">
      <Card>
        <Card.Header className="d-flex justify-content-end bg-light ">
          <Button variant="secondary" className="" onClick={() => navigate("/reports")}>
            ← Back to Reports
          </Button>
        </Card.Header>
      <Card.Body className="p-0 bg-success">

       <Row>
        {/* LEFT COLUMN */}
        <Col md={7}>
          <Card className="p-3 shadow-sm rounded-0">
            <h5 className="fw-bold mb-3">Report Details</h5>

            {report?.image_path && (
              <div className="mb-3 text-center">
                <Image
                  src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
                  alt="Report"
                  fluid
                  className="rounded"
                  style={{ maxHeight: "350px", objectFit: "contain" }}
                />
              </div>
            )}

            {/* Report Meta */}
            <Row className="mb-2 small">
              <Col sm={4} className="fw-semibold">Date:</Col>
              <Col>{FormatDate(report?.created_at)}</Col>
            </Row>
            <Row className="mb-2 small">
              <Col sm={4} className="fw-semibold">Location:</Col>
              <Col>{report?.location || "—"}</Col>
            </Row>

            {/* Description */}
            <div className="mb-3">
              <span className="fw-semibold">Description:</span>
              <Card className="p-2 mt-1 small">
                {report?.description ? (
                  <div dangerouslySetInnerHTML={{ __html: report.description }} style={{ wordBreak: "break-word" }} />
                ) : (
                  <p className="text-muted mb-0">No description provided.</p>
                )}
              </Card>
            </div>

            {/* Editable Fields */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Priority</Form.Label>
                  <Form.Select name="priority" value={formData.priority} onChange={handleInputChange} size="sm">
                    <option value="">Select</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Category</Form.Label>
                  <Form.Select name="category" value={formData.category} onChange={handleInputChange} size="sm">
                    <option value="">Select</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="General Repair">General Repair</option>
                    <option value="Others">Others</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleInputChange} size="sm">
                    <option value="">Select</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Schedule</Form.Label>
                  <Form.Control type="date" name="schedule_date" value={formData.schedule_date} onChange={handleInputChange} size="sm" />
                </Form.Group>
              </Col>
            </Row>

            {/* Staff Assignment */}
            <Form.Group>
              <Form.Label className="fw-semibold small">Assign Staff</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search staff..."
                value={searchStaff}
                onChange={(e) => setSearchStaff(e.target.value)}
                className="mb-2"
                size="sm"
              />
              <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #dee2e6", padding: "6px", background: "#fff" }}>
                {filterStaff.length > 0 ? (
                  filterStaff.map((s) => (
                    <div key={s.id} className="d-flex justify-content-between align-items-center border-bottom py-1 small">
                      <Form.Check
                        type="checkbox"
                        id={`staff-${s.id}`}
                        value={s.id}
                        checked={formData.assigned_staff.includes(String(s.id))}
                        onChange={(e) => {
                          const { checked, value } = e.target;
                          setFormData((prev) => ({
                            ...prev,
                            assigned_staff: checked
                              ? [...prev.assigned_staff, value]
                              : prev.assigned_staff.filter((id) => id !== value),
                          }));
                        }}
                        label={s.name}
                        className="me-2 custom-checkbox"
                      />
                      <small className="text-muted">{s.role}</small>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center small mb-0">No staff available</p>
                )}
              </div>
            </Form.Group>

            <div className="mt-3 d-flex justify-content-end">
              <Button variant="success" size="sm" onClick={handleSave} disabled={!isChanged}>
                Save Changes
              </Button>
            </div>
          </Card>
        </Col>

        {/* RIGHT COLUMN */}
        <Col md={5}>
          <Card className="p-3 shadow-sm h-100 rounded-0">
            <h6 className="fw-bold mb-3">Progress & Remarks</h6>

            {/* Add Remark */}
            <Form className="mt-2" onSubmit={handleProgressRemarks}>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Type your remark..."
                  value={newRemark}
                  onChange={(e) => { setNewRemark(e.target.value.trimStart()); setErrorMessage(""); }}
                  className={`small ${errorMessage ? "is-invalid" : ""}`}
                />
                {errorMessage && <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>}
              </Form.Group>
              <div className="d-flex justify-content-end mt-2">
                <Button variant="primary" type="submit" size="sm" disabled={saveLoading || !newRemark.trim()}>
                  {saveLoading ? <Spinner animation="border" size="sm" /> : "Add Remark"}
                </Button>
              </div>
            </Form>

            {/* Remarks List */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }} className="mt-3">
              {remarks.length > 0 ? (
                <Accordion alwaysOpen>
                  {remarks.map((r, idx) => (
                    <Accordion.Item eventKey={idx.toString()} key={idx}>
                      <Accordion.Header>
                        <div className="d-flex flex-column w-100 small">
                          <span className="fw-semibold">{r.action || "Update"}</span>
                          <span className="text-muted">{FormatDate(r.created_at)}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="small">
                        <p className="mb-1">{r.remark || "—"}</p>
                        <p className="text-muted mb-0">by {r.updated_by || "System"}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted small">No updates yet.</p>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      </Card.Body>

      </Card>
     

      {/* Success Modal */}
      <Modal show={successModal} onHide={() => setSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6">Report Update</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small">The report has been successfully updated.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setSuccessModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>

  );
}

export default ViewReportPage;
