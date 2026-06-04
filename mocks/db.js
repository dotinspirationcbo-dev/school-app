const users = [];
const students = [];
const attendanceRecords = [];
const marksRecords = [];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

module.exports = {
  connect: async () => {
    console.log('🧠 Mock DB initialized');
  },

  users,
  students,
  attendanceRecords,
  marksRecords,

  findUser: (email) => users.find((user) => user.email === email),
  createUser: (user) => {
    const newUser = { ...user, _id: createId() };
    users.push(newUser);
    return newUser;
  },

  findStudentById: (id) => students.find((student) => student._id === id),
  findStudents: () => [...students],
  createStudent: (data) => {
    const student = { ...data, _id: createId(), createdAt: new Date() };
    students.push(student);
    return student;
  },
  updateStudent: (id, data) => {
    const index = students.findIndex((student) => student._id === id);
    if (index === -1) return null;
    students[index] = { ...students[index], ...data };
    return students[index];
  },
  deleteStudent: (id) => {
    const index = students.findIndex((student) => student._id === id);
    if (index === -1) return false;
    students.splice(index, 1);
    return true;
  },

  createAttendance: (data) => {
    const attendance = { ...data, _id: createId(), createdAt: new Date() };
    attendanceRecords.push(attendance);
    return attendance;
  },
  updateAttendance: (id, data) => {
    const index = attendanceRecords.findIndex((record) => record._id === id);
    if (index === -1) return null;
    attendanceRecords[index] = { ...attendanceRecords[index], ...data };
    return attendanceRecords[index];
  },
  findAttendanceByStudent: (studentId) => attendanceRecords.filter((record) => record.studentId === studentId),
  findAttendanceByDate: (date) =>
    date ? attendanceRecords.filter((record) => record.date === date) : [...attendanceRecords],
  findAllAttendance: () => [...attendanceRecords],

  createMarks: (data) => {
    const marks = { ...data, _id: createId(), createdAt: new Date() };
    marksRecords.push(marks);
    return marks;
  },
  findMarks: () => [...marksRecords],
  findMarksByStudent: (studentId) => marksRecords.filter((record) => record.studentId === studentId)
};
