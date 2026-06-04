// Test Marks API

async function testMarks() {
  // STEP 1: Get students
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

  // STEP 2: Login to get token
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

  // STEP 3: Post marks
  console.log("\n📝 STEP 3: Adding marks...");
  const marksRes = await fetch('http://localhost:5000/marks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      studentId: studentId,
      subject: 'Math',
      score: 85,
      grade: 'A',
      term: 'Term 1',
      createdBy: 'Teacher A'
    })
  });

  console.log(`Status: ${marksRes.status}`);
  
  if (marksRes.ok) {
    const marksData = await marksRes.json();
    console.log("\n✅ MARKS CREATED!");
    console.log(JSON.stringify(marksData, null, 2));
  } else {
    const error = await marksRes.text();
    console.log("❌ Error:", error.substring(0, 200));
    return;
  }

  // STEP 4: Get all marks
  console.log("\n📥 STEP 4: Retrieving all marks...");
  const getAllRes = await fetch('http://localhost:5000/marks', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (getAllRes.ok) {
    const allMarks = await getAllRes.json();
    console.log(`\n✅ Retrieved ${allMarks.length} marks record(s):`);
    console.log(JSON.stringify(allMarks, null, 2));
  } else {
    console.log("❌ Failed to retrieve marks");
  }
}

testMarks().catch(console.error);
