// Detailed Test Attendance API

async function testAttendance() {
  console.log("📚 STEP 1: Getting students...");
  const studentsRes = await fetch('http://localhost:5000/students');
  const students = await studentsRes.json();
  console.log(`Found ${students.length} students`);
  
  if (students.length === 0) {
    console.log("⚠️ No students found!");
    return;
  }

  const studentId = students[0]._id;
  console.log(`✅ Using student ID: ${studentId}`);

  // Login
  console.log("\n🔐 Logging in...");
  const loginRes = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@example.com',
      password: 'password123'
    })
  });

  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log(`✅ Token obtained`);

  // Test attendance endpoint
  console.log("\n📝 Posting attendance...");
  const attendanceRes = await fetch('http://localhost:5000/attendance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      studentId: studentId,
      date: '2026-06-01',
      status: 'present',
      markedBy: 'Teacher A'
    })
  });

  console.log(`Status: ${attendanceRes.status}`);
  console.log(`Headers:`, Object.fromEntries(attendanceRes.headers));

  const responseText = await attendanceRes.text();
  console.log(`Response: ${responseText.substring(0, 500)}`);

  if (attendanceRes.ok) {
    try {
      const attendanceData = JSON.parse(responseText);
      console.log("\n✅ SUCCESS!");
      console.log(JSON.stringify(attendanceData, null, 2));
    } catch (e) {
      console.log("❌ Invalid JSON response");
    }
  } else {
    console.log("❌ Error response");
  }
}

testAttendance().catch(console.error);
