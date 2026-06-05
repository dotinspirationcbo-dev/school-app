const http = require('http');

const baseURL = 'http://localhost:5000';

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseURL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting backend API tests...\n');

  try {
    // Use a unique email for each test run
    const testEmail = `student-${Date.now()}@test.com`;

    // Test 1: Register a student
    console.log('✅ Test 1: Register student');
    const registerRes = await makeRequest('POST', '/api/auth/signup', {
      fullName: 'John Doe',
      email: testEmail,
      password: '123456',
      role: 'student'
    });
    console.log(`   Status: ${registerRes.status}`);
    const registerMsg = registerRes.data.data?.message || registerRes.data.message || 'User created';
    console.log(`   Response:`, registerMsg);

    // Test 2: Login as student
    console.log('\n✅ Test 2: Login student');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: '123456'
    });
    console.log(`   Status: ${loginRes.status}`);
    if (loginRes.data.data && loginRes.data.data.token) {
      console.log(`   ✓ Token received: ${loginRes.data.data.token.slice(0, 20)}...`);
      console.log(`   ✓ User role: ${loginRes.data.data.user.role}`);
    } else {
      console.log(`   ✗ Error: ${loginRes.data.message}`);
    }

    const token = loginRes.data.data ? loginRes.data.data.token : null;

    // Test 3: Access student dashboard with token
    console.log('\n✅ Test 3: Student dashboard (with token)');
    const dashboardRes = await makeRequest('GET', '/api/student/dashboard', null, token);
    console.log(`   Status: ${dashboardRes.status}`);
    if (dashboardRes.status === 200) {
      console.log(`   ✓ Dashboard data received`);
    } else if (dashboardRes.status === 401) {
      console.log(`   ✗ Unauthorized (invalid token)`);
    } else {
      console.log(`   Response:`, dashboardRes.data.message || dashboardRes.data);
    }

    // Test 4: Get all students (requires admin/teacher role, but student token will be 403)
    console.log('\n✅ Test 4: Get all students');
    const studentsRes = await makeRequest('GET', '/api/students', null, token);
    console.log(`   Status: ${studentsRes.status}`);
    if (studentsRes.status === 403) {
      console.log(`   ✓ Correctly rejected (student role not authorized). Expected behavior.`);
    } else if (studentsRes.status === 200) {
      console.log(`   Students count: ${Array.isArray(studentsRes.data) ? studentsRes.data.length : 0}`);
    } else {
      console.log(`   Response:`, studentsRes.data.message || studentsRes.data);
    }

    // Test 5: API health check
    console.log('\n✅ Test 5: Health check');
    const healthRes = await makeRequest('GET', '/api/health');
    console.log(`   Status: ${healthRes.status}`);
    console.log(`   Response:`, healthRes.data);

    console.log('\n✅ All tests completed!');
    console.log('\n📌 Frontend is running on: http://localhost:5173');
    console.log('📌 Backend is running on: http://localhost:5000');
    console.log('\n🔐 Test account credentials:');
    console.log(`   Email: ${testEmail}`);
    console.log('   Password: 123456');

  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runTests();
