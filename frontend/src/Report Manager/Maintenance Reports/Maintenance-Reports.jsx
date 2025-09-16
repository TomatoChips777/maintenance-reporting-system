import { useMemo, useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form, Button, Table } from 'react-bootstrap';
import PaginationControls from '../../extra/Paginations';
import ViewReport from './components/ViewReport';
import CreateReport from './components/CreateReport';
import ArchiveAlert from './components/ArchiveAlert';
import axios from 'axios';
import FormatDate from '../../extra/DateFormat';
import TextTruncate from '../../extra/TextTruncate';
import { io } from 'socket.io-client';

function MaintenanceReports() {
    const [reports, setReports] = useState([]);
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

    //fetch reports
    const fetchReports = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_MAINTENANCE_REPORT}`);
            setReports(response.data.reports);

        } catch (error) {
            console.log("Error fetching reports:", error);
        }
    }

    // const filteredReports = useMemo(() => {
    //     return reports.filter(report => {
    //         const matchesSearch =
    //             report.description.toLowerCase().includes(search.toLowerCase()) ||
    //             report.location.toLowerCase().includes(search.toLowerCase()) ||
    //             report.reporter_name.toLowerCase().includes(search.toLowerCase()) ||
    //             report.category.toLowerCase().includes(search.toLowerCase());

    //         const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
    //         const matchesPriority = priorityFilter === 'All' || report.priority === priorityFilter;
    //         return matchesSearch && matchesStatus && matchesPriority;
    //     }) .sort((a, b) => {

    //         const order = { "Pending": 1, "In Progress": 2, "Resolved": 3 };
    //         return (order[a.status] || 99) - (order[b.status] || 99);
    //     });
    // }, [reports, search, statusFilter, priorityFilter]);

    const filteredReports = useMemo(() => {
    return reports.filter(report => {
        const matchesSearch =
            report.description.toLowerCase().includes(search.toLowerCase()) ||
            report.location.toLowerCase().includes(search.toLowerCase()) ||
            report.reporter_name.toLowerCase().includes(search.toLowerCase()) ||
            report.category.toLowerCase().includes(search.toLowerCase());

        const matchesPriority = priorityFilter === 'All' || report.priority === priorityFilter;

        // Only Pending
        const matchesStatus = report.status === "Pending";

        return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
        const order = { "Pending": 1, "In Progress": 2, "Resolved": 3 };
        return (order[a.status] || 99) - (order[b.status] || 99);
    });
}, [reports, search, priorityFilter]);


    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredReports.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredReports, currentPage, itemsPerPage]);

    useEffect(() => {
        fetchReports();
        const socket = io(`${import.meta.env.VITE_API_URL}`);
        socket.on('updateReports', () => {
            fetchReports();
        });

        return () => {
            socket.disconnect();
        };

    }, []);

    const handleOpenViewModal = (report) => {
        setSelectedReport(report);
        setShowViewModal(true)
    };
    const handleCloseViewModal = () => {
        setShowViewModal(false);
    };

    const handleOpenCreateModal = () => {
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
    const getTimeAgo = (timestamp) =>{
        const units = [
            {name: 'year', seconds: 31536000},
            {name: 'month', seconds: 2592000},
            {name: 'day', seconds: 86400},
            {name: 'hr', seconds: 3600},
            {name: 'min', seconds: 60},
            {name: 'sec', seconds: 1},
        ];
        const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
        for(let unit of units){
            const value = Math.floor(diff / unit.seconds);
            if(value> 0) return `${value} ${unit.name}${value > 1 ? 's' : ''} ago`;
        }
        return 'just now';
    }
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
                    {/* <Col md={3}>
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
                    </Col> */}

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

              <ul className="list-unstyled row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 px-3">
                    {currentData.length > 0 ? (
                        currentData.map((report) => (
                            <li key={report.id} className="col">
                                <Card className="h-100 shadow-sm border-1">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="fw-bold">{FormatDate(report.created_at)}</span>
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
                                        </div>

                                        <h6 className="fw-semibold">{report.issue_type}</h6>
                                        <p className="mb-1 text-muted">
                                            <i className="bi bi-person-fill me-2"></i>
                                            {report.is_anonymous ? "Anonymous" : report.reporter_name}
                                        </p>
                                        <p className="mb-1">
                                            <i className="bi bi-geo-alt-fill me-2"></i>
                                            <TextTruncate text={report.location} maxLength={30} />
                                        </p>
                                        <p className="mb-2">
                                            <TextTruncate text={report.description} maxLength={50} />
                                        </p>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="badge bg-secondary">
                                                {getTimeAgo(report.created_at)}
                                            </span>
                                            <div>
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleOpenViewModal(report)}
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
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </li>
                        ))
                    ) : (
                        <li className="col">
                            <Card className="text-center p-3">
                                <Card.Body>No records found.</Card.Body>
                            </Card>
                        </li>
                    )}
                </ul>
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
            
                <ViewReport
                    show={showViewModal}
                    handleClose={handleCloseViewModal}
                    report={selectedReport}
                />

                <CreateReport
                    show={showCreateModal}
                    handleClose={handleCloseCreateModal}
                />

                <ArchiveAlert
                    show={showAlert}
                    handleClose={handleCloseAlert}
                    report={reportToRemove}
                />

        </Container>
    )

};

export default MaintenanceReports;

