import { View, Text, TextInput, StyleSheet } from "react-native";
import AnimatedButton from "./ui/AnimatedButton";

type StudentFormProps = {
  name: string;
  studentClass: string;
  age: string;
  parentContact: string;
  onChangeName: (value: string) => void;
  onChangeStudentClass: (value: string) => void;
  onChangeAge: (value: string) => void;
  onChangeParentContact: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
  loading: boolean;
  errors: {
    name?: string;
    studentClass?: string;
    age?: string;
    parentContact?: string;
  };
};

export default function StudentForm({
  name,
  studentClass,
  age,
  parentContact,
  onChangeName,
  onChangeStudentClass,
  onChangeAge,
  onChangeParentContact,
  onSubmit,
  onCancel,
  isEditing,
  loading,
  errors,
}: StudentFormProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.header}>{isEditing ? "Editing Student" : "Add New Student"}</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={onChangeName}
        style={styles.input}
        returnKeyType="next"
        blurOnSubmit={false}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <TextInput
        placeholder="Class"
        value={studentClass}
        onChangeText={onChangeStudentClass}
        style={styles.input}
        returnKeyType="next"
        blurOnSubmit={false}
      />
      {errors.studentClass ? <Text style={styles.errorText}>{errors.studentClass}</Text> : null}

      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={onChangeAge}
        keyboardType="number-pad"
        style={styles.input}
        returnKeyType="next"
      />
      {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

      <TextInput
        placeholder="Parent contact"
        value={parentContact}
        onChangeText={onChangeParentContact}
        style={styles.input}
        keyboardType="phone-pad"
        returnKeyType="done"
      />
      {errors.parentContact ? <Text style={styles.errorText}>{errors.parentContact}</Text> : null}

      <AnimatedButton
        title={isEditing ? "Update Student" : "Add Student"}
        onPress={onSubmit}
        loading={loading}
        style={styles.primaryButton}
      />

      {isEditing ? (
        <AnimatedButton
          title="Cancel"
          onPress={onCancel}
          variant="secondary"
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "white",
  },
  errorText: {
    color: "#d12c2c",
    marginBottom: 8,
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "white",
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
