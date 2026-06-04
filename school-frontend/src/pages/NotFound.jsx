export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>404</h1>
        <p style={{ fontSize: '20px', color: '#666' }}>Page not found</p>
      </div>
    </div>
  );
}
