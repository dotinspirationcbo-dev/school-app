import { useState, useEffect } from 'react';
import api from '../api/api';
import Table from '../components/Table';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/marks');
        setAttendance(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Attendance</h1>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <Table
        columns={[
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
          { key: 'markedBy', label: 'Marked By' }
        ]}
        data={attendance}
        loading={loading}
      />
    </div>
  );
}
