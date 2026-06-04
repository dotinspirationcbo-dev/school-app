import api from "./api";

// GET all students
export const getStudents = async () => {
  const res = await api.get("/students");
  return res.data;
};

// CREATE student
export const createStudent = async (data: any) => {
  const res = await api.post("/students", data);
  return res.data;
};

// UPDATE student
export const updateStudent = async (id: string, data: any) => {
  const res = await api.put(`/students/${id}`, data);
  return res.data;
};

// DELETE student
export const deleteStudent = async (id: string) => {
  const res = await api.delete(`/students/${id}`);
  return res.data;
};
