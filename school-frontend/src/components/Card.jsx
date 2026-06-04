export default function Card({ title, value, subtitle = '' }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>
        {value}
      </p>
      {subtitle && <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '12px' }}>{subtitle}</p>}
    </div>
  );
}
