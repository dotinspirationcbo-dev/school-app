import { useState, useEffect } from 'react';
import api from '../api/api';
import Table from '../components/Table';

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await api.get('/marks');
        setMarks(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load marks');
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Marks</h1>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <Table
        columns={[
          { key: 'subject', label: 'Subject' },
          { key: 'score', label: 'Score' },
          { key: 'grade', label: 'Grade' },
          { key: 'term', label: 'Term' },
          { key: 'createdBy', label: 'Created By' }
        ]}
        data={marks}
        loading={loading}
      />
    </div>
  );
}
