import { useState, useEffect } from 'react';
import api from '../api/api';
import Card from '../components/Card';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
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
      <h1>Admin Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card
          title="Total Students"
          value={dashboard?.totalStudents}
        />
        <Card
          title="Total Teachers"
          value={dashboard?.totalTeachers}
        />
        <Card
          title="Total Admins"
          value={dashboard?.userStats?.admins}
        />
        <Card
          title="Average Attendance"
          value={`${dashboard?.attendanceRates?.average}%`}
          subtitle={`${dashboard?.attendanceRates?.total} records`}
        />
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2>System Overview</h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>Total Students</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{dashboard?.systemOverview?.totalStudents}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>Total Teachers</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{dashboard?.systemOverview?.totalTeachers}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>Average Attendance</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{dashboard?.systemOverview?.averageAttendance}%</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>Attendance Records</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{dashboard?.systemOverview?.totalAttendanceRecords}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
