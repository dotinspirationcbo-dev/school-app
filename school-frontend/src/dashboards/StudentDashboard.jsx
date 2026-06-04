import { useState, useEffect } from 'react';
import api from '../api/api';
import Card from '../components/Card';
import Table from '../components/Table';

export default function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/student/dashboard');
        setDashboard(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Student Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card
          title="Attendance"
          value={`${dashboard?.attendanceSummary?.percentage}%`}
          subtitle={`${dashboard?.attendanceSummary?.present} Present`}
        />
        <Card
          title="Average Marks"
          value={dashboard?.marksSummary?.averageScore}
          subtitle={`${dashboard?.marksSummary?.totalMarks} entries`}
        />
        <Card
          title="Subjects"
          value={dashboard?.marksSummary?.subjects}
        />
      </div>

      <div>
        <h2>Recent Marks</h2>
        <Table
          columns={[
            { key: 'subject', label: 'Subject' },
            { key: 'score', label: 'Score' },
            { key: 'grade', label: 'Grade' },
            { key: 'term', label: 'Term' }
          ]}
          data={dashboard?.recentActivity?.latestMarks || []}
        />
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Recent Attendance</h2>
        <Table
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status' }
          ]}
          data={dashboard?.recentActivity?.latestAttendance || []}
        />
      </div>
    </div>
  );
}
