import { useEffect, useMemo, useState } from 'react';
import { Container, Table, Form, Button, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import PaginationControls from '../../extra/Paginations';
import AddStaffModal from './components/AddStaffModal';
import EditStaffModal from './components/EditStaffModal';
import FormatDate from '../../extra/DateFormat';
import { useAuth } from '../../../AuthContext';
import { io } from 'socket.io-client';
function Staff() {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    contact_number: '',
    role: '',
    status: 1,
  });

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_GET_MAINTENANCE_STAFF}`);
      setStaff(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateUser', () => {
      fetchStaff();
    });

    return () => {
      socket.disconnect();
    };

  }, []);

  const filteredStaff = useMemo(() => {
    return staff.filter(staff => {
      const matchesSearch =
        staff.name?.toLowerCase().includes(search.toLowerCase()) ||
        staff.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'All' || staff.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [staff, search, roleFilter]);

  // Get unique roles from staff
  const uniqueRoles = useMemo(() => {
    const roles = staff.map(s => s.role).filter(Boolean); // remove null/empty roles
    return ["All", ...new Set(roles)]; // add "All" at the start
  }, [staff]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStaff.slice(start, start + itemsPerPage);
  }, [filteredStaff, currentPage, itemsPerPage]);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (staff) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_ADD_MAINTENANCE_STAFF}`, staff);
      if (res.data.success) {
        setShowAddModal(false);
        resetForm();
        return res.data;
      }

    } catch (err) {
      console.log(err);
      throw err;
    }
  };


const handleEditSubmit = async (staff) => {
  if (!staff || !staff.id) {
    throw new Error("Staff ID missing, cannot update."); // force error if no ID 
  }

  try {
    const res = await axios.put(
      `${import.meta.env.VITE_UPDATE_MAINTENANCE_STAFF_DETAILS}/${staff.id}`,
      staff
    );

    if (res.data.success) {
      setShowEditModal(false);
      return res.data;
    }
  } catch (err) {
    throw err;
  }
};

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
  };


  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleStaffStatus = async (staffId, currentStatus) => {

    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const response = await axios.put(`${import.meta.env.VITE_UPDATE_STAFF_STATUS}/${staffId}`, {
        status: newStatus,
      });
      if (response.data.success) {
        setUsers(staff.map(staff =>
          staff.id === staffId ? { ...staff, status: newStatus } : staff
        ));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setNewStaff({
      name: '',
      email: '',
      contact_number: '',
      role: '',
      status: 1,
    })
  }

  return (
    <Container fluid className="p-0">
      <Card className='p-1'>
        <h1 className="mb-4 text-center">Staff Management</h1>

        <Row className="mb-3 p-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              {uniqueRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="d-flex justify-content-end align-items-center">
            <Button variant='dark' onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus-circle me-2"></i> Add New Staff
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive className='mb-0'>
          <thead className='table-dark'>
            <tr>
              <th>#ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className='text-center'>Status</th>
              <th>Date Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </td>
              </tr>
            ) : currentData.length === 0 ?(
              <tr>
                <td colSpan="7" className='text-center'>
                <Alert variant='light' className='mb-0'>No records found.</Alert>
                </td>
              </tr>
            ) : (
                currentData.map(staff => (
                <tr key={staff.id}>
                  <td>{staff.id}</td>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  <td>{staff.role}</td>
                  <td className='text-center'>
                    <Form.Check
                      type="checkbox"
                      className='custom-checkbox'
                      checked={staff.status === 1}
                      onChange={() => toggleStaffStatus(staff.id, staff.status)}
                    />
                  </td>
                  <td>{FormatDate(staff.created_at)}</td>
                  <td className="text-center">
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(staff)}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <PaginationControls
          filteredReports={filteredStaff}
          pageSize={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handlePageSizeChange={handlePageSizeChange}
        />
      </Card>

      <AddStaffModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        newStaff={newStaff}
        handleChange={handleAddChange}
        uniqueRoles={uniqueRoles}
      />

      <EditStaffModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleEditSubmit}
        staff={selectedStaff || newStaff}
        handleChange={handleEditChange}
        uniqueRoles={uniqueRoles}
      />
    </Container>
  );
}
export default Staff;
