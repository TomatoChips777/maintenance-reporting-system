import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Sidebar({ sidebarOpen, activeLink, handleLinkClick }) {
  const navigate = useNavigate();

  const handleClick = (key) => {
    handleLinkClick(key);
    // Dagdagan kung kailangan
    const routeMap = {
      Dashboard: '/',
      Reports: '/reports',
      Inventory: '/inventory',
      Borrowing: '/borrowing',
      Calendar: '/events',
      Notifications: '/notifications',
      'Lost & Found': '/lost-and-found-reports',
    };
    navigate(routeMap[key]);
  };

  return (
    <div className={`sidebar bg-success text-white ${sidebarOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header text-center py-4">
        <i className="bi bi-search fs-1 text-light"></i>
        {sidebarOpen && <h5 className="mt-2 mb-0">Lost And Found</h5>}
      </div>
      <hr />
      <Nav className="flex-column">
        {[
          { key: 'Dashboard', icon: 'speedometer2' },
          {key: 'Reports', icon: 'clipboard-data'},
          {key: 'Lost & Found', icon: 'search'},
          { key: 'Calendar', icon: 'calendar' },
          { key: 'Notifications', icon: 'bell' },
        ].map(({ key, icon }) => (
          <Nav.Link
            key={key}
            className={`d-flex align-items-center px-3 py-2 rounded-0 ${
              activeLink === key ? 'bg-dark text-white' : 'text-white'
            }`}
            href="#"
            onClick={() => handleClick(key)}
          >
            <i className={`bi bi-${icon} me-2`}></i>
            {sidebarOpen && <span>{key}</span>}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}
export default Sidebar;
