import { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { getStudents } from "../api/students";
import AnimatedButton from "../components/ui/AnimatedButton";
import AnimatedList from "../components/ui/AnimatedList";
import EmptyState from "../components/ui/EmptyState";
import ScreenHeader from "../components/ui/ScreenHeader";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import {
  getAttendanceByDate,
  createAttendance,
  updateAttendance,
} from "../api/attendance";
import { toast } from "../utils/toast";
import { AuthContext } from "../contexts/AuthContext";

const today = new Date().toISOString().split("T")[0];

export default function Attendance() {
  const [students, setStudents] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { isSignedIn, initializing, canMarkAttendance, user } = useContext(AuthContext);

  useEffect(() => {
    if (!initializing && !isSignedIn) {
      router.replace("../login");
    }
  }, [initializing, isSignedIn]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentData, attendanceData] = await Promise.all([
        getStudents(),
        getAttendanceByDate(today),
      ]);
      setStudents(Array.isArray(studentData) ? studentData : []);
      setRecords(Array.isArray(attendanceData) ? attendanceData : []);
    } catch (error) {
      console.log("Attendance load error:", error);
      toast("Error", "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      const attendanceData = await getAttendanceByDate(today);
      setRecords(Array.isArray(attendanceData) ? attendanceData : []);
    } catch (error) {
      console.log("Attendance refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const attendanceMap = useMemo(
    () =>
      records.reduce((acc: any, record: any) => {
        acc[record.studentId] = record;
        return acc;
      }, {}),
    [records]
  );

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;

  const handleStatus = async (student: any, status: string) => {
    setSaving(true);
    try {
      const existing = attendanceMap[student._id];
      let updated;
      if (existing) {
        updated = await updateAttendance(existing._id, {
          status,
          date: today,
          studentId: student._id,
        });
      } else {
        updated = await createAttendance({
          studentId: student._id,
          date: today,
          status,
        });
      }

      setRecords((current) => {
        const withoutCurrent = current.filter((r) => r._id !== updated._id && r.studentId !== updated.studentId);
        return [...withoutCurrent, updated];
      });
      toast("Success", `Marked ${student.name} as ${status}`);
    } catch (error) {
      console.log("Attendance save error:", error);
      toast("Error", `Failed to mark ${student.name}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Attendance for {today}</Text>
        <SkeletonLoader count={3} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Attendance"
        subtitle={`Present: ${presentCount} · Absent: ${absentCount} · Total: ${students.length}`}
        actionLabel="Refresh"
        onAction={refresh}
      />

      {!canMarkAttendance ? (
        <Text style={styles.readOnlyText}>
          {user?.role === "parent"
            ? "Parents can view attendance summaries but cannot mark status."
            : "Students can view attendance only. Marking is reserved for teachers and admins."}
        </Text>
      ) : null}

      <AnimatedList
        data={students}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListEmptyComponent={() => (
          <EmptyState
            icon="📋"
            title="No Students Found"
            message="Add students to your roster first, then you can mark attendance."
            actionLabel="Go to Students"
            onAction={() => router.push("../students")}
          />
        )}
        renderItem={({ item }) => {
          const record = attendanceMap[item._id];
          const status = record?.status || "none";
          return (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text>Class: {item.class}</Text>
                <Text>Status: {status === "none" ? "Not marked" : status}</Text>
              </View>
              <View style={styles.buttons}>
                {canMarkAttendance ? (
                  <>
                    <AnimatedButton
                      title="Present"
                      onPress={() => handleStatus(item, "present")}
                      disabled={saving}
                      style={[styles.statusButton, status === "present" && styles.activePresent]}
                    />
                    <AnimatedButton
                      title="Absent"
                      onPress={() => handleStatus(item, "absent")}
                      disabled={saving}
                      variant="danger"
                      style={[styles.statusButton, status === "absent" && styles.activeAbsent]}
                    />
                  </>
                ) : (
                  <Text style={styles.readOnlyText}>
                    View-only access
                  </Text>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f8fb",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summary: {
    marginBottom: 16,
    color: "#555",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  buttons: {
    justifyContent: "space-between",
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
    minWidth: 90,
    alignItems: "center",
  },
  activePresent: {
    backgroundColor: "#4CAF50",
  },
  activeAbsent: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  readOnlyText: {
    color: "#666",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: "#777",
  },
  skeletonCard: {
    width: "100%",
    height: 90,
    borderRadius: 14,
    backgroundColor: "#e2e2e2",
    marginBottom: 14,
  },
});
