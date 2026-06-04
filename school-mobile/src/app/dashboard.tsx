import { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { getDashboardStats, getTeacherDashboard, getAdminDashboard } from "../api/dashboard";
import { toast } from "../utils/toast";
import AnimatedButton from "../components/ui/AnimatedButton";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ScreenHeader from "../components/ui/ScreenHeader";
import { AuthContext } from "../contexts/AuthContext";

type MetricCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
};

const MetricCard = ({ label, value, unit = "", color = "#007AFF" }: MetricCardProps) => (
  <View style={[styles.metricCard, { borderLeftColor: color }]}> 
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={[styles.metricValue, { color }]}> 
      {value}
      {unit ? <Text style={styles.metricUnit}> {unit}</Text> : null}
    </Text>
  </View>
);

type TrendBadgeProps = {
  trend?: string;
};

const TrendBadge = ({ trend = 'stable' }: TrendBadgeProps) => {
  const colors: Record<string, string> = {
    improving: "#34C759",
    declining: "#FF3B30",
    stable: "#999"
  };
  const badgeColor = colors[trend] || colors.stable;
  return (
    <View style={[styles.trendBadge, { backgroundColor: badgeColor }]}> 
      <Text style={styles.trendText}>
        {trend === "improving" ? "📈" : trend === "declining" ? "📉" : "➡️"} {trend}
      </Text>
    </View>
  );
};

export default function Dashboard() {
  const { user, isSignedIn, initializing, userRole, pushRegistered } = useContext(AuthContext);
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!initializing && !isSignedIn) {
      router.replace("../login");
    }
  }, [initializing, isSignedIn]);

  useEffect(() => {
    loadDashboardData();
  }, [userRole]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (userRole === "teacher" || userRole === "admin") {
        const data = userRole === "admin" ? await getAdminDashboard() : await getTeacherDashboard();
        setAnalytics(data);
      } else {
        const data = await getDashboardStats();
        setStats(data);
      }
    } catch (error) {
      console.log(error);
      toast("Error", "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
      toast("Success", "Dashboard refreshed");
    } catch (error) {
      console.log(error);
      toast("Error", "Unable to refresh dashboard");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 24, backgroundColor: "#f7f8fb" }}>
        <ScreenHeader title="School Dashboard" subtitle="Loading analytics and attendance insights" />
        <SkeletonLoader count={3} />
      </View>
    );
  }

  const roleLabel = userRole === "admin"
    ? "Admin dashboard"
    : userRole === "teacher"
    ? "Teacher dashboard"
    : "Student dashboard";

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader
        title="School Dashboard"
        subtitle={roleLabel}
        statusLabel={pushRegistered ? "Push registered" : "Push not registered"}
        statusVariant={pushRegistered ? "success" : "warning"}
        actionLabel={refreshing ? "Refreshing…" : "Refresh"}
        onAction={refreshDashboard}
      />

      {/* Analytics for Teachers/Admins */}
      {(userRole === "teacher" || userRole === "admin") && analytics ? (
        <View>
          {/* Attendance Trends */}
          <Text style={styles.sectionTitle}>📊 Attendance Analytics</Text>
          <View style={styles.analyticsGrid}>
            <MetricCard
              label="Weekly Attendance"
              value={analytics?.attendanceStats?.trends?.weekly?.toFixed(1) || "0"}
              unit="%"
              color="#007AFF"
            />
            <MetricCard
              label="Monthly Attendance"
              value={analytics?.attendanceStats?.trends?.monthly?.toFixed(1) || "0"}
              unit="%"
              color="#34C759"
            />
          </View>
          {analytics?.attendanceStats?.trends && (
            <TrendBadge trend={analytics.attendanceStats.trends.trend} />
          )}

          {/* Performance Summary */}
          <Text style={styles.sectionTitle}>📈 Performance Summary</Text>
          <View style={styles.analyticsGrid}>
            <MetricCard
              label="Average Score"
              value={analytics?.marksEntrySummary?.performance?.averageScore?.toFixed(1) || "0"}
              color="#FF9500"
            />
            <MetricCard
              label="Top Subject"
              value={analytics?.marksEntrySummary?.performance?.topSubject || "N/A"}
              color="#5AC8FA"
            />
          </View>
          <View style={styles.analyticsGrid}>
            <MetricCard
              label="Top Score"
              value={analytics?.marksEntrySummary?.performance?.topScore || "0"}
              color="#34C759"
            />
            <MetricCard
              label="Subjects"
              value={analytics?.marksEntrySummary?.performance?.subjectsCount || "0"}
              color="#9C27B0"
            />
          </View>

          {/* Growth Metrics */}
          {analytics?.growthMetrics && (
            <>
              <Text style={styles.sectionTitle}>📊 Growth Metrics (Month-over-Month)</Text>
              <View style={styles.analyticsGrid}>
                <MetricCard
                  label="Attendance Growth"
                  value={analytics.growthMetrics.attendanceGrowth?.toFixed(1) || "0"}
                  unit="%"
                  color={analytics.growthMetrics.attendanceGrowth > 0 ? "#34C759" : "#FF3B30"}
                />
                <MetricCard
                  label="Marks Growth"
                  value={analytics.growthMetrics.marksGrowth?.toFixed(1) || "0"}
                  unit="%"
                  color={analytics.growthMetrics.marksGrowth > 0 ? "#34C759" : "#FF3B30"}
                />
              </View>
            </>
          )}

          {/* Class Insights */}
          {analytics?.classesOverview?.classInsights && (
            <>
              <Text style={styles.sectionTitle}>🎓 Class Insights</Text>
              {Object.entries(analytics.classesOverview.classInsights).map(([className, classData]: any) => (
                <View key={className} style={styles.classInsightCard}>
                  <Text style={styles.classInsightTitle}>{className}</Text>
                  <View style={styles.analyticsGrid}>
                    <MetricCard
                      label="Students"
                      value={classData.studentCount}
                      color="#007AFF"
                    />
                    <MetricCard
                      label="Avg Attendance"
                      value={classData.averageAttendance?.toFixed(1) || "0"}
                      unit="%"
                      color="#34C759"
                    />
                    <MetricCard
                      label="Avg Marks"
                      value={classData.averageMarks?.toFixed(1) || "0"}
                      color="#FF9500"
                    />
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      ) : (
        /* Simple Stats for Students */
        <>
          <Text style={styles.sectionTitle}>📊 Your Summary</Text>
          <MetricCard
            label="Total Students"
            value={stats?.totalStudents ?? "0"}
            color="#007AFF"
          />
          <MetricCard
            label="Present Today"
            value={stats?.presentCount ?? "0"}
            color="#34C759"
          />
          <MetricCard
            label="Absent Today"
            value={stats?.absentCount ?? "0"}
            color="#FF3B30"
          />
          <MetricCard
            label="Attendance Today"
            value={stats?.attendanceToday ?? "0"}
            unit="%"
            color="#FF9500"
          />
        </>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {userRole !== "student" && (
          <>
            <AnimatedButton
              title="Manage Students"
              onPress={() => router.push("../students")}
              style={{ marginTop: 12 }}
            />
            <AnimatedButton
              title="Mark Attendance"
              onPress={() => router.push("../attendance")}
              style={{ marginTop: 12, backgroundColor: "#34C759" }}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f7f8fb",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
    color: "#111",
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
    marginRight: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: "500",
  },
  trendBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  trendText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  classInsightCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  classInsightTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },
  actionsContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
});
