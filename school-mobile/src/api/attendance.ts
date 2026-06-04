import api from "./api";

export const getAttendanceByDate = async (date: string) => {
  const res = await api.get(`/attendance?date=${encodeURIComponent(date)}`);
  return res.data;
};

export const createAttendance = async (data: any) => {
  const res = await api.post("/attendance", data);
  return res.data;
};

export const updateAttendance = async (id: string, data: any) => {
  const res = await api.put(`/attendance/${id}`, data);
  return res.data;
};
