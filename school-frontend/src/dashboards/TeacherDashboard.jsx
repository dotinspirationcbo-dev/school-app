import { useState, useEffect } from 'react';
import api from '../api/api';
import Card from '../components/Card';
import Table from '../components/Table';

export default function TeacherDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/teacher/dashboard');
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
      <h1>Teacher Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card
          title="Students"
          value={dashboard?.assignedStudents}
        />
        <Card
          title="Classes"
          value={dashboard?.classesOverview?.totalClasses}
          subtitle={`Avg ${dashboard?.classesOverview?.averageClassSize} per class`}
        />
        <Card
          title="Attendance"
          value={`${dashboard?.attendanceStats?.averageAttendance}%`}
          subtitle={`${dashboard?.attendanceStats?.presentCount} present`}
        />
        <Card
          title="Marks Recorded"
          value={dashboard?.marksEntrySummary?.totalEntriesRecorded}
        />
      </div>

      <div>
        <h2>Subjects Covered</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {dashboard?.marksEntrySummary?.subjects?.map((subject) => (
            <span
              key={subject}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px'
              }}
            >
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
