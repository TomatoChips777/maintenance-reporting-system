import { useMemo, useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import PaginationControls from '../../extra/Paginations';
import ViewReport from './components/ViewReport';
import CreateReport from './components/CreateReport';
import ArchiveAlert from './components/ArchiveAlert';
import axios from 'axios';
import FormatDate from '../../extra/DateFormat';
import TextTruncate from '../../extra/TextTruncate';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function Reports() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [staff, setStaff] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedReport, setSelectedReport] = useState('');
    const [reportToRemove, setReportToRemove] = useState('');
    const [loading, setLoading] = useState(true);
    //fetch reports
    const fetchReports = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_MAINTENANCE_REPORT}`);
            setReports(response.data.reports || []);

        } catch (error) {
            setLoading(false);
            console.log("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchStaff = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_GET_MAINTENANCE_STAFF}`);
            setStaff(response.data || []);
        } catch (error) {

        }
    }
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchesSearch =
                report.description?.toLowerCase().includes(search.toLowerCase()) ||
                report.location?.toLowerCase().includes(search.toLowerCase()) ||
                report.reporter_name?.toLowerCase().includes(search.toLowerCase()) ||
                report.category?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
            const matchesPriority = priorityFilter === 'All' || report.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        }).sort((a, b) => {
            // Custom sort: Pending first, then In Progress, then Resolved
            const order = { "Pending": 1, "In Progress": 2, "Resolved": 3 };
            return (order[a.status] || 99) - (order[b.status] || 99);
        });
    }, [reports, search, statusFilter, priorityFilter]);


    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredReports.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredReports, currentPage, itemsPerPage]);

    useEffect(() => {
        fetchReports();
        fetchStaff();
        const socket = io(`${import.meta.env.VITE_API_URL}`);
        socket.on('updateReports', () => {
            fetchReports();
        });

        return () => {
            socket.disconnect();
        };

    }, []);

    const handleOpenViewModal = async (report) => {
        if (report.viewed === 0) {
            try {
                const response = await axios.put(`${import.meta.env.VITE_MARK_AS_VIEWED}/${report?.id}`);
            } catch (error) {

            }
        }
        fetchStaff();
        setSelectedReport(report);
        setShowViewModal(true)
    };
    const handleViewReportPage = async (report) => {
        if (report.viewed === 0) {
            try {
                const response = await axios.put(`${import.meta.env.VITE_MARK_AS_VIEWED}/${report?.id}`);
            } catch (error) {

            }
        }
        fetchStaff();
        navigate('/view-report', { state: { reportId: report.id, staff } });
        // console.log("Reports:", report, "Staff:", staff);

    }
    const handleCloseViewModal = () => {
        setShowViewModal(false);
    };

    const handleOpenCreateModal = () => {
        fetchStaff();
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };
    const handleShowAlert = (report) => {

        setShowAlert(true);
        setReportToRemove(report);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handlePageSizeChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    return (
        <Container fluid className='p-0 y-0' >
            <Card className='p-1'>

                <h1 className='mb-4 text-center'>
                    Reports Management
                </h1>
                <Row className="mb-3 p-3 align-items-end">
                    {/* Search */}
                    <Col md={4}>
                        <Form.Group controlId="searchReports">
                            <Form.Label>Search</Form.Label>
                            <Form.Control
                                className='p-3 border-1'
                                type="text"
                                placeholder="Search Reports"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Form.Group>
                    </Col>

                    {/* Status Filter */}
                    <Col md={3}>
                        <Form.Group controlId="filterStatus">
                            <Form.Label>Filter By Status</Form.Label>
                            <Form.Select
                                className='p-3 border-1'
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Priority Filter */}
                    <Col md={3}>
                        <Form.Group controlId="filterPriority">
                            <Form.Label>Filter By Priority</Form.Label>
                            <Form.Select
                                className='p-3 border-1'
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* New Report Button */}
                    <Col md={2} className="d-flex justify-content-end">
                        <Button variant="dark" className='p-3' onClick={handleOpenCreateModal}>
                            <i className="bi bi-plus-circle me-2"></i>
                            New Report
                        </Button>
                    </Col>
                </Row>

                <Table striped bordered hover responsive className='mb-0'>

                    <thead className='table-dark'>
                        <tr>
                            <th>Date</th>
                            <th>Reported By</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th className='text-center'>Priority</th>
                            <th className='text-center'>Status</th>
                            <th className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    <Spinner animation='border' variant='primary' />
                                </td>
                            </tr>
                        ) : currentData.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    <Alert variant="light" className="mb-0">
                                        No records found.
                                    </Alert>
                                </td>
                            </tr>
                        ) : (
                            currentData.map(report => (
                                <tr key={report.id}>
                                    <td>{FormatDate(report.created_at)}</td>
                                    <td>{report.reporter_name}</td>
                                    <td><TextTruncate text={report.location} maxLength={30} /></td>
                                    {/* <td><TextTruncate text={report.description} maxLength={50} /></td> */}
                                    <td><TextTruncate
                                        text={
                                            report?.description
                                                ? report.description
                                                    .replace(/<[^>]+>/g, " ")   // strip HTML tags from Quill
                                                    .replace(/\s+/g, " ")       // collapse whitespace
                                                    .trim()
                                                : "No description provided."
                                        }
                                        maxLength={50}
                                    /></td>
                                    <td>{report.category}</td>
                                    <td className="text-center">{report.priority}</td>
                                    <td className="text-center">
                                        <span
                                            className={`badge rounded-0 ${report.status === "Pending"
                                                ? "bg-warning text-dark"
                                                : report.status === "In Progress"
                                                    ? "bg-primary"
                                                    : "bg-success"
                                                }`}
                                        >
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <Button
                                            variant="info"
                                            size="sm"
                                            className="me-2"
                                            // onClick={() => handleOpenViewModal(report)}
                                            onClick={() => handleViewReportPage(report)}

                                        >
                                            <i className="bi bi-eye"></i>
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleShowAlert(report)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
                <Card.Footer>
                    <PaginationControls
                        filteredReports={filteredReports}
                        pageSize={itemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        handlePageSizeChange={handlePageSizeChange}
                    />
                </Card.Footer>
            </Card>

            {/* View Report Modal */}
            <ViewReport
                show={showViewModal}
                handleClose={handleCloseViewModal}
                report={selectedReport}
                staff={staff}
            />

            {/* Create Report Modal */}
            <CreateReport
                show={showCreateModal}
                handleClose={handleCloseCreateModal}
                staff={staff}
            />

            {/* Archive Alert Modal */}
            <ArchiveAlert
                show={showAlert}
                handleClose={handleCloseAlert}
                report={reportToRemove}
            />

        </Container>
    )

};

export default Reports;

