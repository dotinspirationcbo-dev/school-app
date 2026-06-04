export default function Table({ columns, data, loading = false }) {
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#333'
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            style={{
              borderBottom: '1px solid #eee',
              backgroundColor: rowIdx % 2 === 0 ? '#fff' : '#fafafa'
            }}
          >
            {columns.map((col) => (
              <td
                key={`${rowIdx}-${col.key}`}
                style={{
                  padding: '12px',
                  color: '#666'
                }}
              >
                {row[col.key] || '-'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
