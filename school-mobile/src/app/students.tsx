import { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import AnimatedList from "../components/ui/AnimatedList";
import EmptyState from "../components/ui/EmptyState";
import ScreenHeader from "../components/ui/ScreenHeader";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/students";
import StudentForm from "../components/StudentForm";
import StudentCard from "../components/StudentCard";
import { toast } from "../utils/toast";
import { AuthContext } from "../contexts/AuthContext";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [age, setAge] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    studentClass: "",
    age: "",
    parentContact: "",
  });

  const { user, isSignedIn, initializing, canEditStudents } = useContext(AuthContext);

  useEffect(() => {
    if (!initializing && !isSignedIn) {
      router.replace("../login");
    }
  }, [initializing, isSignedIn]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStudents = async () => {
    setRefreshing(true);
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error refreshing students:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const resetForm = () => {
    setName("");
    setStudentClass("");
    setAge("");
    setParentContact("");
    setEditingStudentId(null);
    setErrors({ name: "", studentClass: "", age: "", parentContact: "" });
  };

  const validateForm = () => {
    const nextErrors: any = {};
    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!studentClass.trim()) nextErrors.studentClass = "Class is required.";
    if (!age.trim()) nextErrors.age = "Age is required.";
    if (!parentContact.trim()) nextErrors.parentContact = "Parent contact is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast("Validation", "Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        class: studentClass,
        age,
        parentContact,
      };

      if (editingStudentId) {
        await updateStudent(editingStudentId, payload);
        toast("Success", "Student updated successfully.");
      } else {
        await createStudent(payload);
        toast("Success", "Student added successfully.");
      }

      await fetchStudents();
      resetForm();
    } catch (error) {
      console.log("Student save error:", error);
      toast("Error", "Unable to save student.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudentId(student._id);
    setName(student.name || "");
    setStudentClass(student.class || "");
    setAge(String(student.age || ""));
    setParentContact(student.parentContact || "");
  };

  const handleDelete = async (student: any) => {
    try {
      await deleteStudent(student._id);
      await fetchStudents();
      toast("Success", "Student deleted successfully.");
    } catch (error) {
      console.log("Delete error:", error);
      toast("Error", "Unable to delete student.");
    }
  };

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const lowerSearch = search.toLowerCase();
    return students.filter((student) =>
      student.name?.toLowerCase().includes(lowerSearch)
    );
  }, [search, students]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { padding: 20 }]}> 
        <SkeletonLoader count={3} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Student Management"
        subtitle={`Showing ${filteredStudents.length} of ${students.length} students`}
      />

      {canEditStudents ? (
        <StudentForm
          name={name}
          studentClass={studentClass}
          age={age}
          parentContact={parentContact}
          onChangeName={setName}
          onChangeStudentClass={setStudentClass}
          onChangeAge={setAge}
          onChangeParentContact={setParentContact}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={Boolean(editingStudentId)}
          loading={submitting}
          errors={errors}
        />
      ) : (
        <Text style={styles.readOnlyText}>
          {user?.role === "parent"
            ? "Parents can view child student details only. Contact a teacher for updates."
            : "Students can view the roster only. Editing requires teacher or admin access."}
        </Text>
      )}

      <Text style={styles.countText}>
        Showing {filteredStudents.length} of {students.length} students
      </Text>

      <AnimatedList
        data={filteredStudents}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshStudents} />
        }
        contentContainerStyle={
          filteredStudents.length === 0 ? styles.emptyListContainer : undefined
        }
        ListEmptyComponent={() => (
          <EmptyState
            icon="👨‍🎓"
            title="No Students Yet"
            message="Add your first student to get started with attendance tracking."
            actionLabel={canEditStudents ? "Add Student" : undefined}
            onAction={canEditStudents ? () => window.scrollTo(0, 0) : undefined}
          />
        )}
        renderItem={({ item }) => (
          <StudentCard
            student={item}
            isSelected={item._id === editingStudentId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEditStudents}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f7",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "white",
  },
  countText: {
    marginBottom: 12,
    color: "#555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#555",
  },
  readOnlyText: {
    marginBottom: 16,
    color: "#666",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
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
