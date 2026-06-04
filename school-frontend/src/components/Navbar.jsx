export default function Navbar({ user }) {
  return (
    <nav style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0, fontSize: '20px' }}>School Management System</h1>
      <div>
        <span style={{ marginRight: '15px' }}>
          {user?.fullName} ({user?.role})
        </span>
      </div>
    </nav>
  );
}
