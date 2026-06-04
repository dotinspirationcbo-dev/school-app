const mockDB = process.env.USE_MOCK_DB === 'true';

const calculateAttendancePercentage = (attendanceRecords) => {
  if (attendanceRecords.length === 0) return 0;
  const presentCount = attendanceRecords.filter((r) => r.status === 'present').length;
  return ((presentCount / attendanceRecords.length) * 100).toFixed(2);
};

const calculateAverageMarks = (marksRecords) => {
  if (marksRecords.length === 0) return 0;
  const totalScore = marksRecords.reduce((sum, m) => sum + (m.score || 0), 0);
  return (totalScore / marksRecords.length).toFixed(2);
};

const calculateSystemStats = (students, teachers, attendanceRecords) => {
  const totalAttendance = attendanceRecords.length > 0 ? calculateAttendancePercentage(attendanceRecords) : 0;
  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    averageAttendance: totalAttendance,
    totalAttendanceRecords: attendanceRecords.length
  };
};

const calculateAttendanceTrends = (attendanceRecords) => {
  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return { weekly: 0, monthly: 0, trend: 'stable' };
  }

  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weeklyRecords = attendanceRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= weekAgo && recordDate <= today;
  });

  const monthlyRecords = attendanceRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= monthAgo && recordDate <= today;
  });

  const weeklyPercentage = calculateAttendancePercentage(weeklyRecords);
  const monthlyPercentage = calculateAttendancePercentage(monthlyRecords);

  const trend = weeklyPercentage > monthlyPercentage ? 'improving' : weeklyPercentage < monthlyPercentage ? 'declining' : 'stable';

  return {
    weekly: parseFloat(weeklyPercentage),
    monthly: parseFloat(monthlyPercentage),
    trend
  };
};

const calculatePerformanceSummary = (marksRecords) => {
  if (!Array.isArray(marksRecords) || marksRecords.length === 0) {
    return {
      averageScore: 0,
      topScore: 0,
      lowestScore: 0,
      subjectsCount: 0,
      topSubject: 'N/A'
    };
  }

  const scores = marksRecords.map((m) => m.score || 0);
  const average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
  const topScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);

  const subjectScores = {};
  marksRecords.forEach((m) => {
    if (!subjectScores[m.subject]) {
      subjectScores[m.subject] = [];
    }
    subjectScores[m.subject].push(m.score || 0);
  });

  let topSubject = 'N/A';
  let topAverage = 0;
  Object.keys(subjectScores).forEach((subject) => {
    const avg = subjectScores[subject].reduce((a, b) => a + b, 0) / subjectScores[subject].length;
    if (avg > topAverage) {
      topAverage = avg;
      topSubject = subject;
    }
  });

  return {
    averageScore: parseFloat(average),
    topScore,
    lowestScore,
    subjectsCount: Object.keys(subjectScores).length,
    topSubject
  };
};

const calculateGrowthMetrics = (attendanceRecords, marksRecords) => {
  const today = new Date();
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const lastTwoMonths = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

  const currentMonthAttendance = attendanceRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= lastMonth && recordDate <= today;
  });

  const previousMonthAttendance = attendanceRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= lastTwoMonths && recordDate < lastMonth;
  });

  const currentMonthPercentage = parseFloat(calculateAttendancePercentage(currentMonthAttendance)) || 0;
  const previousMonthPercentage = parseFloat(calculateAttendancePercentage(previousMonthAttendance)) || 0;

  const attendanceGrowth = previousMonthPercentage > 0
    ? ((currentMonthPercentage - previousMonthPercentage) / previousMonthPercentage * 100).toFixed(2)
    : 0;

  const currentMonthMarks = marksRecords.filter((m) => {
    const recordDate = new Date(m.createdAt);
    return recordDate >= lastMonth && recordDate <= today;
  });

  const previousMonthMarks = marksRecords.filter((m) => {
    const recordDate = new Date(m.createdAt);
    return recordDate >= lastTwoMonths && recordDate < lastMonth;
  });

  const currentAvg = parseFloat(calculateAverageMarks(currentMonthMarks)) || 0;
  const previousAvg = parseFloat(calculateAverageMarks(previousMonthMarks)) || 0;

  const marksGrowth = previousAvg > 0
    ? ((currentAvg - previousAvg) / previousAvg * 100).toFixed(2)
    : 0;

  return {
    attendanceGrowth: parseFloat(attendanceGrowth),
    marksGrowth: parseFloat(marksGrowth),
    currentMonthAttendance: currentMonthPercentage,
    currentMonthMarksAvg: currentAvg
  };
};

const calculateClassLevelInsights = (students, attendanceRecords, marksRecords) => {
  if (!Array.isArray(students) || students.length === 0) {
    return {};
  }

  const classeMap = {};

  students.forEach((student) => {
    const className = student.class || 'Unknown';
    if (!classeMap[className]) {
      classeMap[className] = { count: 0, attendance: [], marks: [] };
    }
    classeMap[className].count++;

    const studentAttendance = attendanceRecords.filter((a) => String(a.studentId) === String(student._id));
    const studentMarks = marksRecords.filter((m) => String(m.studentId) === String(student._id));

    classeMap[className].attendance.push(...studentAttendance);
    classeMap[className].marks.push(...studentMarks);
  });

  const classInsights = {};
  Object.keys(classeMap).forEach((className) => {
    const classData = classeMap[className];
    classInsights[className] = {
      studentCount: classData.count,
      averageAttendance: parseFloat(calculateAttendancePercentage(classData.attendance)) || 0,
      averageMarks: parseFloat(calculateAverageMarks(classData.marks)) || 0
    };
  });

  return classInsights;
};

module.exports = {
  calculateAttendancePercentage,
  calculateAverageMarks,
  calculateSystemStats,
  calculateAttendanceTrends,
  calculatePerformanceSummary,
  calculateGrowthMetrics,
  calculateClassLevelInsights
};
