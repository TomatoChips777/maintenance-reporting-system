// --- existing imports remain ---
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../../../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FormatDate from "../../extra/DateFormat";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { io } from "socket.io-client";
import isEqual from "lodash/isEqual";


const formats = [
    'background', 'bold', 'color', 'font', 'code', 'italic', 'link', 'size',
    'strike', 'script', 'underline', 'blockquote', 'header', 'indent',
    'list', 'align', 'direction', 'code-block', 'formula'
];

//  Extend Quill clipboard to block images only
const Clipboard = Quill.import("modules/clipboard");

class CustomClipboard extends Clipboard {
    onPaste(e) {
        if (!e.clipboardData || !this.quill) return;

        const items = e.clipboardData.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    e.preventDefault(); // block images
                    return;
                }
            }
        }
        // Allow normal paste for text / formatting
        super.onPaste(e);
    }
}

Quill.register("modules/clipboard", CustomClipboard, true);

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
        socket.on("updateReports", () => fetchReport());
        return () => socket.disconnect();
    }, [reportId]);

    // --- Recipients Setup ---
    const [recipients] = useState([
        { id: 1, name: "Admin Office", email: "goldengrape777@gmail.com" },
        { id: 2, name: "Maintenance Dept", email: "cabase.1324@gmail.com" },
        { id: 3, name: "Security Office", email: "gelocabase1324@gmail.com" },
        { id: 4, name: "Student Affairs", email: "godenpaper777@gmail.com" },
    ]);

    const [toRecipients, setToRecipients] = useState([]);
    const [ccRecipients, setCcRecipients] = useState([]);
    const [bccRecipients, setBccRecipients] = useState([]);
    const [recipientType, setRecipientType] = useState("to");
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

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

    // --- Handle Recipient Selection ---
    const handleSelectRecipient = (recipient) => {
        const stateMap = {
            to: [toRecipients, setToRecipients],
            cc: [ccRecipients, setCcRecipients],
            bcc: [bccRecipients, setBccRecipients],
        };
        const [list, setter] = stateMap[recipientType];
        const exists = list.some((r) => r.id === recipient.id);
        setter(exists ? list.filter((r) => r.id !== recipient.id) : [...list, recipient]);
    };

    // --- Save Changes Logic remains same ---
    const handleSave = async () => {
        if (!report?.id) return;
        if (!formData.priority || !formData.report_type) {
            setErrorMessage("Please select both a priority and report type before saving.");
            setShowError(true);
            return;
        }
        if (formData.report_type === "Maintenance" && !formData.category) {
            setErrorMessage("Please select a category before saving.");
            setShowError(true);
            return;
        }

        try {
            setSaving(true);
            const response = await axios.put(`${import.meta.env.VITE_UPDATE_REPORT}/${report.id}`, formData);
            if (response.status === 200) setShowSuccessModal(true);
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to save changes.");
            setShowError(true);
        } finally {
            setSaving(false);
        }
    };

    // --- Message Sending ---
    const sanitizeQuillContent = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim();
    const plainDesc = sanitizeQuillContent(message);

    const handleSendMessage = async () => {
        if (
            toRecipients.length === 0 &&
            ccRecipients.length === 0 &&
            bccRecipients.length === 0
        ) return;

        if (!plainDesc) {
            setErrorMessage("Message cannot be empty.");
            setShowError(true);
            return;
        }

        try {
            setSending(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/send-email`, {
                to: toRecipients.map((r) => r.email),
                cc: ccRecipients.map((r) => r.email),
                bcc: bccRecipients.map((r) => r.email),
                subject: subject || `Report #${report.id} - ${report.report_type}`,
                message: plainDesc,
                html: message,
            });
            setMessage("");
            setSubject("");
            setToRecipients([]);
            setCcRecipients([]);
            setBccRecipients([]);
            setEmailSuccessModal(true);
        } catch (err) {
            console.error("Email sending error:", err);
            setErrorMessage("Failed to send email. Please try again.");
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
        <Container fluid className="mt-0">

            <Card className="mb-3 shadow-sm">
                <Card.Header className="fw-semibold small d-flex justify-content-between">
                    <h5>Report Information</h5>
                    <Button variant="secondary" size="sm" className="" onClick={() => navigate("/reports")}>
                        ← Back to Reports
                    </Button>
                </Card.Header>
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
                   <Card className="p-2 mb-2 small" style={{ height: "200px", overflowY: "auto" }}>
                        {report?.description ? (
                            <div
                            dangerouslySetInnerHTML={{ __html: report.description }}
                            style={{
                                wordBreak: "break-word",
                                fontSize: "0.9rem",
                            }}
                            className="text-muted"
                            />
                        ) : (
                            <p className="mb-0 text-muted">No description provided.</p>
                        )}
                        </Card>

                        {/* <Card className="p-2 mb-2 small">
                            {report?.description ? (
                                <div
                                    dangerouslySetInnerHTML={{ __html: report.description }}
                                    style={{ wordBreak: "break-word", fontSize: "0.9rem", width: '100%' }}
                                    className="text-muted"
                                />
                            ) : (
                                <p className="mb-0 text-muted">No description provided.</p>
                            )}
                        </Card> */}

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
            <Row>
                {/* Left - Report Info */}
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="small">
                            <div className="mb-1">
                                <strong>To:</strong>{" "}
                                {toRecipients.length > 0 ? (
                                    toRecipients.map((r) => (
                                        <Badge
                                            bg="info"
                                            key={r.id}
                                            className="me-1 position-relative"
                                            style={{ cursor: "pointer", paddingRight: "1.2rem" }}
                                        >
                                            {r.name}
                                            <span
                                                onClick={() =>
                                                    setToRecipients(toRecipients.filter((x) => x.id !== r.id))
                                                }
                                                style={{
                                                    marginLeft: "6px",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                    color: "#fff",
                                                    position: "absolute",
                                                    right: "4px",
                                                    top: "0",
                                                }}
                                            >
                                                ×
                                            </span>
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-muted">None</span>
                                )}
                            </div>

                            {ccRecipients.length > 0 && (
                                <div className="mb-1">
                                    <strong>CC:</strong>{" "}
                                    {ccRecipients.map((r) => (
                                        <Badge
                                            bg="secondary"
                                            key={r.id}
                                            className="me-1 position-relative"
                                            style={{ cursor: "pointer", paddingRight: "1.2rem" }}
                                        >
                                            {r.name}
                                            <span
                                                onClick={() =>
                                                    setCcRecipients(ccRecipients.filter((x) => x.id !== r.id))
                                                }
                                                style={{
                                                    marginLeft: "6px",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                    color: "#fff",
                                                    position: "absolute",
                                                    right: "4px",
                                                    top: "0",
                                                }}
                                            >
                                                ×
                                            </span>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {bccRecipients.length > 0 && (
                                <div>
                                    <strong>BCC:</strong>{" "}
                                    {bccRecipients.map((r) => (
                                        <Badge
                                            bg="dark"
                                            key={r.id}
                                            className="me-1 position-relative"
                                            style={{ cursor: "pointer", paddingRight: "1.2rem" }}
                                        >
                                            {r.name}
                                            <span
                                                onClick={() =>
                                                    setBccRecipients(bccRecipients.filter((x) => x.id !== r.id))
                                                }
                                                style={{
                                                    marginLeft: "6px",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                    color: "#fff",
                                                    position: "absolute",
                                                    right: "4px",
                                                    top: "0",
                                                }}
                                            >
                                                ×
                                            </span>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </Card.Header>

                        {/* <Card.Header className="small">
                                <div><strong>To:</strong> {toRecipients.map((r) => <Badge bg="info" key={r.id} className="me-1">{r.name}</Badge>)}</div>
                                {ccRecipients.length > 0 && (
                                    <div><strong>CC:</strong> {ccRecipients.map((r) => <Badge bg="secondary" key={r.id} className="me-1">{r.name}</Badge>)}</div>
                                )}
                                {bccRecipients.length > 0 && (
                                    <div><strong>BCC:</strong> {bccRecipients.map((r) => <Badge bg="dark" key={r.id} className="me-1">{r.name}</Badge>)}</div>
                                )}
                            </Card.Header> */}

                        <Card.Body>
                            <Form.Group className="mb-2">
                                <Form.Label className="small fw-semibold">Email Subject</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    placeholder="Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </Form.Group>
                            <ReactQuill
                                theme="snow"
                                value={message}
                                onChange={setMessage}
                                placeholder="Describe the issue..."
                                style={{ height: "120px", marginBottom: "60px", fontSize: "0.9rem" }}
                                formats={formats}
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, false] }],          // Headers H1, H2, H3
                                        ['bold', 'italic', 'underline', 'strike'], // Text styling
                                        [{ list: 'ordered' }, { list: 'bullet' }], // Lists
                                        // ['blockquote', 'code-block'],            // Blockquote & code
                                        ['link'],                                // Links
                                        [{ align: [] }],                         // Text alignment
                                        [{ color: [] }],     // Color options
                                        ['clean']                                // Remove formatting
                                    ],
                                    clipboard: {
                                        matchVisual: false
                                    }
                                }}
                            />
                            {/* <ReactQuill
                                    theme="snow"
                                    value={message}
                                    onChange={setMessage}
                                    placeholder="Write your message..."
                                    style={{ height: "120px", marginBottom: "60px", fontSize: "0.9rem" }}
                                /> */}
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSendMessage}
                                disabled={
                                    sending ||
                                    !subject.trim() ||
                                    !plainDesc ||
                                    (
                                        toRecipients.length === 0 &&
                                        ccRecipients.length === 0 &&
                                        bccRecipients.length === 0
                                    )
                                }
                                    // disabled={sending || (!subject.trim() || !plainDesc || (toRecipients.length < 0 || ccRecipients.length < 0 || bccRecipients.length < 0))}
                                    >
                                {sending ? "Sending..." : "Send Message"}
                            </Button>
                        </Card.Footer>
                    </Card>

                </Col>

                {/* Right - Recipients + Message */}
                <Col md={4}>
                    <Card className="shadow-sm mb-3">
                        <Card.Header className="fw-semibold small d-flex justify-content-between align-items-center">
                            <span>Select Recipients</span>
                            <Form.Select
                                size="sm"
                                value={recipientType}
                                onChange={(e) => setRecipientType(e.target.value)}
                                style={{ width: "120px" }}
                            >
                                <option value="to">To</option>
                                <option value="cc">CC</option>
                                <option value="bcc">BCC</option>
                            </Form.Select>
                        </Card.Header>
                        <div className="p-2">
                            <Form.Control
                                type="text"
                                placeholder="Search recipients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="sm"
                            />
                        </div>

                        <ListGroup variant="flush" style={{ maxHeight: "500px", overflowY: "auto" }}>
                            {filteredRecipients.length > 0 ? (
                                filteredRecipients.map((r) => {
                                    const active =
                                        (recipientType === "to" && toRecipients.some((sr) => sr.id === r.id)) ||
                                        (recipientType === "cc" && ccRecipients.some((sr) => sr.id === r.id)) ||
                                        (recipientType === "bcc" && bccRecipients.some((sr) => sr.id === r.id));

                                    return (
                                        <ListGroup.Item
                                            key={r.id}
                                            action
                                            className={`py-1 px-2 small ${active ? "bg-info text-white" : ""}`}
                                            onClick={() => handleSelectRecipient(r)}
                                        >
                                            <strong>{r.name}</strong>
                                            <div className="text-muted small">{r.email}</div>
                                        </ListGroup.Item>
                                    );
                                })
                            ) : (
                                <ListGroup.Item className="text-center small text-muted py-2">
                                    No results found
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                    {/* Selected Recipients */}
                    {/* {(toRecipients.length > 0 || ccRecipients.length > 0 || bccRecipients.length > 0) && ()} */}
                </Col>
                {/* Email Success Modal */}
                <Modal show={emailSuccessModal} onHide={() => setEmailSuccessModal(false)}>
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
