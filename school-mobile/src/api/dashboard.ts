import api from "./api";

// get dashboard stats
export const getDashboardStats = async () => {
  const res = await api.get("/api/dashboard/stats");
  return res.data;
};

// get teacher dashboard with analytics
export const getTeacherDashboard = async () => {
  const res = await api.get("/api/dashboard/teacher/dashboard");
  return res.data;
};

// get admin dashboard with analytics
export const getAdminDashboard = async () => {
  const res = await api.get("/api/dashboard/admin/dashboard");
  return res.data;
};

// get student dashboard
export const getStudentDashboard = async () => {
  const res = await api.get("/api/dashboard/student/dashboard");
  return res.data;
};
