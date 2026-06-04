import { useState, useEffect } from 'react';
import api from '../api/api';
import Table from '../components/Table';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Students</h1>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <Table
        columns={[
          { key: 'fullName', label: 'Name' },
          { key: 'class', label: 'Class' },
          { key: 'age', label: 'Age' },
          { key: 'parentContact', label: 'Parent Contact' }
        ]}
        data={students}
        loading={loading}
      />
    </div>
  );
}
