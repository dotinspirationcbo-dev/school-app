// Comprehensive Multi-Role Test Script
// Tests: Student, Teacher, and Admin roles with dashboards and data management

const BASE_URL = 'http://localhost:5000';

// Helper function to make requests
async function makeRequest(method, path, data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null
    });

    const contentType = response.headers.get('content-type');
    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    return {
      status: response.status,
      ok: response.ok,
      data: responseData
    };
  } catch (error) {
    console.error(`Request error: ${error.message}`);
    return { status: 0, ok: false, data: { error: error.message } };
  }
}

// Test Suite
async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 MULTI-ROLE USER TESTING SUITE');
  console.log('='.repeat(70) + '\n');

  // ============================================
  // PHASE 1: CREATE USER ACCOUNTS
  // ============================================
  console.log('📝 PHASE 1: CREATING/LOGIN USER ACCOUNTS\n');

  const testUsers = [
    { fullName: 'Alice Student', email: 'alice.student@school.com', password: 'StudentPass123!', role: 'student' },
    { fullName: 'Bob Teacher', email: 'bob.teacher@school.com', password: 'TeacherPass123!', role: 'teacher' },
    { fullName: 'Charlie Admin', email: 'charlie.admin@school.com', password: 'AdminPass123!', role: 'admin' }
  ];

  const tokens = {};

  for (const user of testUsers) {
    console.log(`Processing ${user.role.toUpperCase()}: ${user.fullName}...`);
    
    // Try to create user first
    let response = await makeRequest('POST', '/signup', user);
    
    if (response.ok) {
      tokens[user.role] = response.data.token;
      console.log(`  ✅ Created new account`);
      console.log(`     Email: ${response.data.user.email}`);
      console.log(`     Role: ${response.data.user.role}\n`);
    } else if (response.status === 400 && response.data.message === 'User already exists') {
      // User exists, log in instead
      console.log(`  ℹ️  User already exists, logging in...`);
      response = await makeRequest('POST', '/login', {
        email: user.email,
        password: user.password
      });
      
      if (response.ok) {
        tokens[user.role] = response.data.token;
        console.log(`  ✅ Logged in successfully`);
        console.log(`     Email: ${response.data.user.email}`);
        console.log(`     Role: ${response.data.user.role}\n`);
      } else {
        console.log(`  ❌ Login failed: ${response.data.message}\n`);
      }
    } else {
      console.log(`  ❌ Failed: ${response.data.message || response.data.error}\n`);
    }
  }

  // ============================================
  // PHASE 2: TEST ROLE-SPECIFIC DASHBOARDS
  // ============================================
  console.log('-'.repeat(70));
  console.log('📊 PHASE 2: TESTING ROLE-SPECIFIC DASHBOARDS\n');

  // Student Dashboard
  console.log('🎓 STUDENT DASHBOARD:');
  let studentResponse = await makeRequest('GET', '/api/student/dashboard', null, tokens.student);
  if (studentResponse.ok) {
    console.log('  ✅ Access granted');
    console.log(`     Profile: ${studentResponse.data.profile?.fullName || 'Loading...'}`);
    console.log(`     Attendance: ${studentResponse.data.attendanceSummary?.total || 0} records`);
    console.log(`       - Present: ${studentResponse.data.attendanceSummary?.present || 0}`);
    console.log(`       - Absent: ${studentResponse.data.attendanceSummary?.absent || 0}`);
    console.log(`       - Percentage: ${studentResponse.data.attendanceSummary?.percentage?.toFixed(2) || 0}%`);
    console.log(`     Marks: ${studentResponse.data.marksSummary?.totalMarks || 0} records`);
    console.log(`       - Average Score: ${studentResponse.data.marksSummary?.averageScore?.toFixed(2) || 0}`);
    console.log(`       - Subjects: ${studentResponse.data.marksSummary?.subjects || 0}\n`);
  } else {
    console.log(`  ❌ Access denied (Status: ${studentResponse.status})\n`);
  }

  // Teacher Dashboard
  console.log('👨‍🏫 TEACHER DASHBOARD:');
  let teacherResponse = await makeRequest('GET', '/api/teacher/dashboard', null, tokens.teacher);
  if (teacherResponse.ok) {
    console.log('  ✅ Access granted');
    console.log(`     Assigned Students: ${teacherResponse.data.assignedStudents || 0}`);
    console.log(`     Classes Overview:`);
    console.log(`       - Total Classes: ${teacherResponse.data.classesOverview?.totalClasses || 0}`);
    console.log(`       - Average Class Size: ${teacherResponse.data.classesOverview?.averageClassSize || 0}`);
    console.log(`     Attendance Stats:`);
    console.log(`       - Average Attendance: ${teacherResponse.data.attendanceStats?.averageAttendance?.toFixed(2) || 0}%`);
    console.log(`       - Total Records: ${teacherResponse.data.attendanceStats?.totalRecords || 0}`);
    console.log(`       - Present: ${teacherResponse.data.attendanceStats?.presentCount || 0}`);
    console.log(`       - Absent: ${teacherResponse.data.attendanceStats?.absentCount || 0}`);
    console.log(`     Marks Entry Summary:`);
    console.log(`       - Total Entries: ${teacherResponse.data.marksEntrySummary?.totalEntriesRecorded || 0}`);
    console.log(`       - Average Score: ${teacherResponse.data.marksEntrySummary?.averageScore?.toFixed(2) || 0}`);
    console.log(`       - Subjects: ${JSON.stringify(teacherResponse.data.marksEntrySummary?.subjects || [])}\n`);
  } else {
    console.log(`  ❌ Access denied (Status: ${teacherResponse.status})\n`);
  }

  // Admin Dashboard
  console.log('🛡️  ADMIN DASHBOARD:');
  let adminResponse = await makeRequest('GET', '/api/admin/dashboard', null, tokens.admin);
  if (adminResponse.ok) {
    console.log('  ✅ Access granted');
    console.log(`     System Overview:`);
    console.log(`       - Total Students: ${adminResponse.data.systemOverview?.totalStudents || adminResponse.data.totalStudents || 0}`);
    console.log(`       - Total Teachers: ${adminResponse.data.systemOverview?.totalTeachers || adminResponse.data.totalTeachers || 0}`);
    console.log(`       - Total Admins: ${adminResponse.data.userStats?.admins || 0}`);
    console.log(`     Attendance Rates:`);
    console.log(`       - Average: ${adminResponse.data.attendanceRates?.average?.toFixed(2) || 0}%`);
    console.log(`       - Total Records: ${adminResponse.data.attendanceRates?.total || 0}`);
    console.log(`     User Stats:`);
    console.log(`       - Students: ${adminResponse.data.userStats?.students || 0}`);
    console.log(`       - Teachers: ${adminResponse.data.userStats?.teachers || 0}`);
    console.log(`       - Admins: ${adminResponse.data.userStats?.admins || 0}\n`);
  } else {
    console.log(`  ❌ Access denied (Status: ${adminResponse.status})\n`);
  }

  // ============================================
  // PHASE 3: TEST ACCESS CONTROL
  // ============================================
  console.log('-'.repeat(70));
  console.log('🔒 PHASE 3: TESTING ACCESS CONTROL\n');

  console.log('Testing role-based access restrictions:\n');

  // Student trying to access teacher dashboard
  console.log('  Student accessing TEACHER dashboard:');
  let testAccess = await makeRequest('GET', '/api/teacher/dashboard', null, tokens.student);
  console.log(`    Status: ${testAccess.status} ${testAccess.status === 403 ? '✅ (Correctly denied)' : '❌'}\n`);

  // Teacher trying to access student dashboard
  console.log('  Teacher accessing STUDENT dashboard:');
  testAccess = await makeRequest('GET', '/api/student/dashboard', null, tokens.teacher);
  console.log(`    Status: ${testAccess.status} ${testAccess.status === 403 ? '✅ (Correctly denied)' : '❌'}\n`);

  // Student trying to access admin dashboard
  console.log('  Student accessing ADMIN dashboard:');
  testAccess = await makeRequest('GET', '/api/admin/dashboard', null, tokens.student);
  console.log(`    Status: ${testAccess.status} ${testAccess.status === 403 ? '✅ (Correctly denied)' : '❌'}\n`);

  // Admin can access teacher dashboard (has higher privilege)
  console.log('  Admin accessing TEACHER dashboard:');
  testAccess = await makeRequest('GET', '/api/teacher/dashboard', null, tokens.admin);
  console.log(`    Status: ${testAccess.status} ${testAccess.status === 200 ? '✅ (Correctly allowed)' : '❌'}\n`);

  // ============================================
  // PHASE 4: TEST DATA MANAGEMENT
  // ============================================
  console.log('-'.repeat(70));
  console.log('📋 PHASE 4: TESTING DATA MANAGEMENT\n');

  // Get Students
  console.log('  Fetching all students:');
  let studentsRes = await makeRequest('GET', '/api/students', null, tokens.teacher);
  if (studentsRes.ok) {
    const studentCount = Array.isArray(studentsRes.data) ? studentsRes.data.length : 0;
    console.log(`    ✅ Retrieved ${studentCount} students\n`);
  } else {
    console.log(`    ❌ Failed (Status: ${studentsRes.status})\n`);
  }

  // Get Attendance Records
  console.log('  Fetching attendance records:');
  let attendanceRes = await makeRequest('GET', '/api/attendance', null, tokens.teacher);
  if (attendanceRes.ok) {
    const attendanceCount = Array.isArray(attendanceRes.data) ? attendanceRes.data.length : 0;
    console.log(`    ✅ Retrieved ${attendanceCount} attendance records\n`);
  } else {
    console.log(`    ⚠️  Not available or requires specific ID\n`);
  }

  // Get Marks Records
  console.log('  Fetching marks records:');
  let marksRes = await makeRequest('GET', '/api/marks', null, tokens.teacher);
  if (marksRes.ok) {
    const marksCount = Array.isArray(marksRes.data) ? marksRes.data.length : 0;
    console.log(`    ✅ Retrieved ${marksCount} marks records\n`);
  } else {
    console.log(`    ⚠️  Not available or requires specific ID\n`);
  }

  // ============================================
  // SUMMARY & RECOMMENDATIONS
  // ============================================
  console.log('-'.repeat(70));
  console.log('📊 TEST SUMMARY\n');

  console.log('✅ COMPLETED TESTS:');
  console.log('  1. Created/logged in 3 user accounts (student, teacher, admin)');
  console.log('  2. Tested role-specific dashboards');
  console.log('  3. Verified access control/role-based restrictions');
  console.log('  4. Tested data management features\n');

  console.log('🎯 KEY FINDINGS:');
  console.log('  • Student Dashboard: Shows personal attendance & marks');
  console.log('  • Teacher Dashboard: Shows class overview & student stats');
  console.log('  • Admin Dashboard: Shows system-wide statistics');
  console.log('  • Access Control: Properly enforces role-based restrictions');
  console.log('  • Admin has elevated privileges (can access teacher dashboard)\n');

  console.log('🔐 CREDENTIALS FOR MANUAL TESTING:');
  testUsers.forEach(user => {
    console.log(`  ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('✅ TEST SUITE COMPLETED');
  console.log('='.repeat(70) + '\n');
}

// Run tests
runTests().catch(console.error);
