import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? '#007bff' : '#333';

  const links = {
    student: [
      { path: '/student/dashboard', label: 'Dashboard' },
      { path: '/student/marks', label: 'My Marks' },
      { path: '/student/attendance', label: 'Attendance' }
    ],
    teacher: [
      { path: '/teacher/dashboard', label: 'Dashboard' },
      { path: '/teacher/students', label: 'Students' },
      { path: '/teacher/attendance', label: 'Attendance' },
      { path: '/teacher/marks', label: 'Marks' }
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/students', label: 'Students' },
      { path: '/admin/attendance', label: 'Attendance' },
      { path: '/admin/marks', label: 'Marks' }
    ]
  };

  const userLinks = links[user?.role] || [];

  return (
    <div style={{
      width: '250px',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRight: '1px solid #ddd',
      minHeight: '100vh'
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>School App</h2>
      <nav>
        {userLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              display: 'block',
              padding: '10px 15px',
              marginBottom: '10px',
              color: isActive(link.path),
              textDecoration: 'none',
              borderRadius: '4px',
              backgroundColor: location.pathname === link.path ? '#e7f3ff' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}
