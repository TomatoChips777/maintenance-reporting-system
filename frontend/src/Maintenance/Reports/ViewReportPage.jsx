import { Container, Card, Button, Row, Col, Form, Image, ListGroup, Accordion, Spinner } from "react-bootstrap";
import FormatDate from "../../extra/DateFormat";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../AuthContext";


function ViewReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { report, staff } = location.state || {};
  const [newRemark, setNewRemark] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    priority: "",
    status: "",
    category: "",
    location: "",
    schedule_date: "",
    assigned_staff: [],
    updated_by: user?.id,
  });

  const [remarks, setRemarks] = useState([]);
  const [searchStaff, setSearchStaff] = useState("");

  useEffect(() => {
    if (report) {
      setFormData({
        priority: report.priority || "",
        status: report.status || "",
        category: report.category || "",
        location: report.location || "",
        schedule_date: report.schedule_date || "",
        assigned_staff: report.assigned_staff
          ? report.assigned_staff.split(",").map(String)
          : [],
        updated_by: user?.id,

      });
      fetchRemarks(report.id);
    }
  }, [report]);

  const fetchRemarks = async (reportId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_GET_REPORT_REMARKS}/${reportId}`
      );
      if (res.data.success) {
        setRemarks(res.data.remarks || []);
      }
    } catch (err) {
      console.error("Failed to fetch remarks:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filterStaff = useMemo(() => {
    return (
      staff?.filter((s) => {
        const matchesSearch =
          s.name?.toLowerCase().includes(searchStaff.toLowerCase()) ||
          s.role?.toLowerCase().includes(searchStaff.toLowerCase());
        return matchesSearch;
      }) || []
    );
  }, [staff, searchStaff]);
  // const handleSave = async () => {
  //   if (!report?.id) return;
  //   try {
  //     const payload = {
  //       ...formData,
  //       assigned_staff: formData.assigned_staff.join(","),
  //     };
  //     await axios.put(
  //       `${import.meta.env.VITE_UPDATE_MAINTENANCE_REPORT}/${report.id}`,
  //       payload
  //     );

  //     alert("Report updated successfully!");

  //     // Re-fetch remarks and updated report so UI refreshes
  //     fetchRemarks(report.id);

  //     // If you want to update the report details on-screen:
  //     setFormData((prev) => ({
  //       ...prev,
  //       ...payload,
  //     }));

  //   } catch (err) {
  //     alert("Error saving report. Please try again.");
  //   }
  // };

  // const handleSave = async () => {
  //   if (!report?.id) return;
  //   try {
  //     const payload = {
  //       ...formData,
  //       assigned_staff: formData.assigned_staff.join(","),
  //     };
  //     await axios.put(
  //       `${import.meta.env.VITE_UPDATE_MAINTENANCE_REPORT}/${report.id}`,
  //       payload
  //     );
  //     alert("Report updated successfully!");
  //     navigate("/reports");
  //   } catch (err) {
  //     alert("Error saving report. Please try again.");
  //   }
  // };
  const handleProgressRemarks = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    if (!newRemark.trim()) {
      setErrorMessage("Remark cannot be empty.");
      setSaveLoading(false);
      return;
    }


    try {
      await axios.post(
        `${import.meta.env.VITE_ADD_REPORT_REMARKS}/${report.id}`,
        {
          remark: newRemark,
          action: formData.status,
          updated_by: user?.id,
        }
      );

      setRemarks((prev) => [
        {
          remark: newRemark,
          action: formData.status,
          updated_by: user?.name || 'System',
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNewRemark("");
    } catch (err) {
      console.error("Failed to add remark:", err);
    }finally{
      setSaveLoading(false);
    }
  };

  const handleSave = async () => {
    if (!report?.id) return;
    try {
      const payload = {
        ...formData,
        assigned_staff: formData.assigned_staff.join(","),
      };

      await axios.put(
        `${import.meta.env.VITE_UPDATE_MAINTENANCE_REPORT}/${report.id}`,
        payload
      );

      const updatedReportRes = await axios.get(
        `${import.meta.env.VITE_GET_REPORT}/${report.id}`
      );

      if (updatedReportRes.data.success) {
        const updatedReport = updatedReportRes.data.report;
        setFormData({
          priority: updatedReport.priority || "",
          status: updatedReport.status || "",
          category: updatedReport.category || "",
          location: updatedReport.location || "",
          schedule_date: updatedReport.schedule_date || "",
          assigned_staff: updatedReport.assigned_staff
            ? updatedReport.assigned_staff.split(",").map(String)
            : [],
          updated_by: user?.id,
        });
      }
      
      // Also refresh remarks after update
      fetchRemarks(report.id);

      alert("Report updated successfully!");
    } catch (err) {
      alert("Error saving report. Please try again.");
    }
  };
if (!report) {
  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-sm text-center" style={{ maxWidth: "500px", width: "100%" }}>
        <h4 className="mb-3">No Report Found</h4>
        <p className="text-muted mb-4">
          The report you are trying to view does not exist or may have been removed.
        </p>
        <Button variant="secondary" onClick={() => navigate("/reports")}>
          <i className="bi bi-arrow-left me-2"></i> Back to Reports
        </Button>
      </Card>
    </Container>
  );
}


  return (
    <Container fluid className="p-3">
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate("/reports")}
      >
        ← Back to Reports
      </Button>

      <Row>
        {/* LEFT SIDE – Report details */}
        <Col md={7}>
          <Card className="p-3 shadow-sm">
            <h4 className="mb-3">Viewing Report</h4>

            {report?.image_path && (
              <div className="mb-3 text-center">
                <Image
                  src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
                  alt="Report"
                  fluid
                  style={{
                    maxHeight: "350px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}

            <Row className="mb-3">
              <Col sm={4}>
                <strong>Date:</strong>
              </Col>
              <Col>{FormatDate(report?.created_at)}</Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4}>
                <strong>Location:</strong>
              </Col>
              <Col>{report?.location || "—"}</Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4}>
                <strong>Description:</strong>
              </Col>
              <Col>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    padding: "8px",
                    border: "1px solid #dee2e6",
                    borderRadius: "0.25rem",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  {report?.description || "—"}
                </div>
              </Col>
            </Row>

            {/* Editable Fields */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Priority</strong>
                  </Form.Label>
                  <Form.Select
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
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Category</strong>
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select category</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="General Repair">General Repair</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Status</strong>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Set Schedule</strong>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="schedule_date"
                    value={formData.schedule_date}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Staff Assignment */}
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>
                    <strong>Assign Staff</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search staff..."
                    value={searchStaff}
                    onChange={(e) => setSearchStaff(e.target.value)}
                    className="mb-2"
                  />
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid #dee2e6",
                      padding: "6px",
                      background: "#fff",
                    }}
                  >
                    {filterStaff.length > 0 ? (
                      filterStaff.map((s) => (
                        <div
                          key={s.id}
                          className="d-flex justify-content-between align-items-center border-bottom py-2"
                        >
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
                      <p className="text-muted text-center mb-0">
                        No staff available
                      </p>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3 d-flex justify-content-end">
              <Button variant="success" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </Card>
        </Col>
        {/* RIGHT SIDE – Remarks / History */}
        <Col md={5}>
          <Card className="p-3 shadow-sm h-100">
            <h5 className="mb-3">Progress & Remarks</h5>

            {/* Add new remark */}
            <Form className="mt-3" onSubmit={handleProgressRemarks}>
              <Form.Group>
                <Form.Control
                className={`${errorMessage ? 'is-invalid' : ''}`}
                  as="textarea"
                  rows={4}
                  placeholder="Type your remark here..."
                  value={newRemark}
                  onChange={(e) => {setNewRemark(e.target.value.trimStart()); setErrorMessage("")}}
                />
                {errorMessage && (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <div className="d-flex justify-content-end mt-2">
                <Button variant="primary" type="submit" size="sm" disabled={saveLoading}>
                  {/* Add Remark */}
                  {saveLoading ? <Spinner animation="border" size="sm"/> : 'Add Remark'}
                </Button>
              </div>
            </Form>

            {/* Remarks history with Accordion */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }} className="mt-3">
              {remarks.length > 0 ? (
                <Accordion alwaysOpen>
                  {remarks.map((r, idx) => (
                    <Accordion.Item eventKey={idx.toString()} key={idx}>
                      <Accordion.Header>
                        <div className="d-flex flex-column w-100">
                          <span><strong>{r.action || "Update"}</strong></span>
                          <small className="text-muted">{FormatDate(r.created_at)}</small>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="mb-1">{r.remark || "—"}</p>
                        <small className="text-muted">by {r.updated_by || "System"}</small>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted">No updates yet.</p>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewReportPage;
