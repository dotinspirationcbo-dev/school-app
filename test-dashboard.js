// Test Student Dashboard

async function testDashboard() {
  // STEP 1: Create a student user and login
  console.log("🔐 STEP 1: Creating/Login student user...");
  
  // First, create a student if needed
  const signupRes = await fetch('http://localhost:5000/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Alice Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student'
    })
  });

  console.log(`Signup response: ${signupRes.status}`);

  // Login as student
  const loginRes = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@example.com',
      password: 'password123'
    })
  });

  const loginData = await loginRes.json();
  
  if (!loginData.token) {
    console.log("❌ Login failed!");
    console.log(loginData);
    return;
  }

  const studentToken = loginData.token;
  const studentId = loginData.user.id;
  
  console.log(`✅ Student logged in with ID: ${studentId}`);

  // STEP 2: Get student dashboard
  console.log("\n📊 STEP 2: Fetching student dashboard...");
  
  const dashboardRes = await fetch('http://localhost:5000/student/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });

  console.log(`Status: ${dashboardRes.status}`);

  if (dashboardRes.ok) {
    const dashboard = await dashboardRes.json();
    console.log("\n✅ STUDENT DASHBOARD:");
    console.log(JSON.stringify(dashboard, null, 2));
    
    console.log(`\nSummary:`);
    console.log(`  Student ID: ${dashboard.studentId}`);
    console.log(`  Marks Records: ${dashboard.marks.length}`);
    console.log(`  Attendance Records: ${dashboard.attendance.length}`);
  } else {
    const error = await dashboardRes.text();
    console.log("❌ Failed to fetch dashboard");
    console.log(error.substring(0, 200));
  }

  // STEP 3: Test with teacher token (should fail with 403)
  console.log("\n🚫 STEP 3: Testing access control (teacher trying to access student dashboard)...");
  
  const teacherLoginRes = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@example.com',
      password: 'password123'
    })
  });

  const teacherData = await teacherLoginRes.json();
  const teacherToken = teacherData.token;

  const accessDeniedRes = await fetch('http://localhost:5000/student/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${teacherToken}`
    }
  });

  console.log(`Teacher access attempt status: ${accessDeniedRes.status}`);
  if (accessDeniedRes.status === 403) {
    console.log("✅ Access correctly denied to teacher!");
    const error = await accessDeniedRes.json();
    console.log(`Message: ${error.message}`);
  } else {
    console.log("❌ Access control failed!");
  }
}

testDashboard().catch(console.error);
