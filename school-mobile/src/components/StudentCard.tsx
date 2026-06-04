import { View, Text, StyleSheet } from "react-native";
import AnimatedButton from "./ui/AnimatedButton";

type StudentCardProps = {
  student: any;
  isSelected: boolean;
  onEdit: (student: any) => void;
  onDelete: (student: any) => void;
  canEdit?: boolean;
};

export default function StudentCard({
  student,
  isSelected,
  onEdit,
  onDelete,
  canEdit = true,
}: StudentCardProps) {
  return (
    <View style={[styles.card, isSelected && styles.selectedCard]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{student.name}</Text>
        <Text>Class: {student.class}</Text>
        <Text>Age: {student.age}</Text>
        <Text>Parent: {student.parentContact}</Text>
      </View>
      {canEdit ? (
        <View style={styles.actions}>
          <AnimatedButton
            title="Edit"
            onPress={() => onEdit(student)}
            style={styles.editButton}
            textStyle={styles.actionText}
            variant="secondary"
          />
          <AnimatedButton
            title="Delete"
            onPress={() => onDelete(student)}
            style={styles.deleteButton}
            textStyle={styles.actionText}
            variant="danger"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "white",
  },
  selectedCard: {
    borderColor: "#007AFF",
    backgroundColor: "#e8f0ff",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  actions: {
    justifyContent: "space-between",
    marginLeft: 12,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 8,
    borderRadius: 6,
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
  },
});
