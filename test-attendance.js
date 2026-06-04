// Test Attendance API

async function testAttendance() {
  // STEP 1: Get all students
  console.log("📚 STEP 1: Getting students...");
  const studentsRes = await fetch('http://localhost:5000/students');
  const students = await studentsRes.json();
  console.log(`Found ${students.length} students`);
  
  if (students.length === 0) {
    console.log("⚠️ No students found. Create a student first!");
    return;
  }

  const studentId = students[0]._id;
  console.log(`✅ Using student ID: ${studentId}`);

  // STEP 2: Login to get token
  console.log("\n🔐 STEP 2: Logging in...");
  const loginRes = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@example.com',
      password: 'password123'
    })
  });

  if (!loginRes.ok) {
    console.log("❌ Login failed. Creating test user first...");
    // Create a test user first
    const signupRes = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Teacher A',
        email: 'teacher@example.com',
        password: 'password123',
        role: 'teacher'
      })
    });
    
    if (!signupRes.ok) {
      const error = await signupRes.json();
      console.log("Signup response:", error);
    } else {
      console.log("✅ User created successfully");
    }

    // Try login again
    const loginRes2 = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginRes2.json();
    console.log("Login response:", loginData);
    
    if (!loginData.token) {
      console.log("❌ Failed to get token");
      return;
    }
    
    const token = loginData.token;
    console.log(`✅ Token: ${token.substring(0, 20)}...`);

    // STEP 3: Post to attendance
    console.log("\n📝 STEP 3: Posting attendance...");
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

    const attendanceData = await attendanceRes.json();
    console.log("\n📊 Attendance Response:");
    console.log(JSON.stringify(attendanceData, null, 2));
    
    if (attendanceRes.ok) {
      console.log("\n✅ ATTENDANCE RECORD CREATED SUCCESSFULLY!");
    } else {
      console.log("\n❌ Failed to create attendance");
    }
  } else {
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log(`✅ Token: ${token.substring(0, 20)}...`);

    // STEP 3: Post to attendance
    console.log("\n📝 STEP 3: Posting attendance...");
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

    const attendanceData = await attendanceRes.json();
    console.log("\n📊 Attendance Response:");
    console.log(JSON.stringify(attendanceData, null, 2));
    
    if (attendanceRes.ok) {
      console.log("\n✅ ATTENDANCE RECORD CREATED SUCCESSFULLY!");
    } else {
      console.log("\n❌ Failed to create attendance");
    }
  }
}

testAttendance().catch(console.error);
