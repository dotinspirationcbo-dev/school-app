import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const endpoint =
        user?.role === 'admin'
          ? '/api/admin/dashboard'
          : user?.role === 'teacher'
          ? '/api/teacher/dashboard'
          : '/api/student/dashboard';

      const response = await api.get(endpoint);
      setDashboard(response.data);
    } catch (err) {
      console.log('Error fetching dashboard:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.nameText}>{user?.fullName}</Text>
          <Text style={styles.roleText}>Role: {user?.role.toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Student Dashboard */}
      {user?.role === 'student' && dashboard && (
        <View style={styles.content}>
          <DashboardCard title="👤 Profile" content={dashboard.profile} />
          <DashboardCard
            title="📚 Marks Summary"
            items={[
              {
                label: 'Total Marks',
                value: dashboard.marksSummary?.totalMarks || 0,
              },
              {
                label: 'Average Score',
                value: `${dashboard.marksSummary?.averageScore?.toFixed(2) || 0}`,
              },
              {
                label: 'Subjects',
                value: dashboard.marksSummary?.subjects || 0,
              },
            ]}
          />
          <DashboardCard
            title="📋 Attendance Summary"
            items={[
              {
                label: 'Total Records',
                value: dashboard.attendanceSummary?.total || 0,
              },
              {
                label: 'Present',
                value: dashboard.attendanceSummary?.present || 0,
              },
              {
                label: 'Absent',
                value: dashboard.attendanceSummary?.absent || 0,
              },
              {
                label: 'Percentage',
                value: `${dashboard.attendanceSummary?.percentage?.toFixed(2) || 0}%`,
              },
            ]}
          />
        </View>
      )}

      {/* Teacher Dashboard */}
      {user?.role === 'teacher' && dashboard && (
        <View style={styles.content}>
          <DashboardCard
            title="👨‍🎓 Class Overview"
            items={[
              {
                label: 'Assigned Students',
                value: dashboard.assignedStudents || 0,
              },
              {
                label: 'Total Classes',
                value: dashboard.classesOverview?.totalClasses || 0,
              },
              {
                label: 'Avg Class Size',
                value: dashboard.classesOverview?.averageClassSize || 0,
              },
            ]}
          />
          <DashboardCard
            title="📊 Attendance Stats"
            items={[
              {
                label: 'Average Attendance',
                value: `${dashboard.attendanceStats?.averageAttendance?.toFixed(2) || 0}%`,
              },
              {
                label: 'Total Records',
                value: dashboard.attendanceStats?.totalRecords || 0,
              },
              {
                label: 'Present',
                value: dashboard.attendanceStats?.presentCount || 0,
              },
              {
                label: 'Absent',
                value: dashboard.attendanceStats?.absentCount || 0,
              },
            ]}
          />
          <DashboardCard
            title="📝 Marks Entry Summary"
            items={[
              {
                label: 'Total Entries',
                value: dashboard.marksEntrySummary?.totalEntriesRecorded || 0,
              },
              {
                label: 'Average Score',
                value: `${dashboard.marksEntrySummary?.averageScore?.toFixed(2) || 0}`,
              },
              {
                label: 'Subjects',
                value: (
                  dashboard.marksEntrySummary?.subjects?.length || 0
                ).toString(),
              },
            ]}
          />
        </View>
      )}

      {/* Admin Dashboard */}
      {user?.role === 'admin' && dashboard && (
        <View style={styles.content}>
          <DashboardCard
            title="🏢 System Overview"
            items={[
              {
                label: 'Total Students',
                value:
                  dashboard.systemOverview?.totalStudents ||
                  dashboard.totalStudents ||
                  0,
              },
              {
                label: 'Total Teachers',
                value:
                  dashboard.systemOverview?.totalTeachers ||
                  dashboard.totalTeachers ||
                  0,
              },
              {
                label: 'Total Admins',
                value: dashboard.userStats?.admins || 0,
              },
            ]}
          />
          <DashboardCard
            title="👥 User Statistics"
            items={[
              { label: 'Students', value: dashboard.userStats?.students || 0 },
              { label: 'Teachers', value: dashboard.userStats?.teachers || 0 },
              { label: 'Admins', value: dashboard.userStats?.admins || 0 },
            ]}
          />
          <DashboardCard
            title="📈 Attendance Rates"
            items={[
              {
                label: 'Average Attendance',
                value: `${dashboard.attendanceRates?.average?.toFixed(2) || 0}%`,
              },
              {
                label: 'Total Records',
                value: dashboard.attendanceRates?.total || 0,
              },
            ]}
          />
        </View>
      )}

      <View style={styles.spacing} />
    </ScrollView>
  );
}

function DashboardCard({ title, content, items }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {content && (
        <View style={styles.cardContent}>
          {Object.entries(content).map(([key, value]) => (
            <View key={key} style={styles.item}>
              <Text style={styles.itemLabel}>{key}:</Text>
              <Text style={styles.itemValue}>{value || '-'}</Text>
            </View>
          ))}
        </View>
      )}
      {items && (
        <View style={styles.cardContent}>
          {items.map((item, idx) => (
            <View key={idx} style={styles.item}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
  },
  welcomeText: {
    fontSize: 14,
    color: '#ccc',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  roleText: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  cardContent: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  spacing: {
    height: 20,
  },
});
