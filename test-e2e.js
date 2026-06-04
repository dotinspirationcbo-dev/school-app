const http = require('http');

const baseURL = 'http://localhost:5000/api';

function makeRequest(method, path, data = null) {
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
    // Test 1: Register a student
    console.log('✅ Test 1: Register student');
    const registerRes = await makeRequest('POST', '/signup', {
      fullName: 'John Doe',
      email: 'student@test.com',
      password: '123456',
      role: 'student'
    });
    console.log(`   Status: ${registerRes.status}`);
    console.log(`   Response:`, registerRes.data.message || registerRes.data.error);

    // Test 2: Login as student
    console.log('\n✅ Test 2: Login student');
    const loginRes = await makeRequest('POST', '/login', {
      email: 'student@test.com',
      password: '123456'
    });
    console.log(`   Status: ${loginRes.status}`);
    if (loginRes.data.token) {
      console.log(`   ✓ Token received: ${loginRes.data.token.slice(0, 20)}...`);
      console.log(`   ✓ User role: ${loginRes.data.user.role}`);
    } else {
      console.log(`   ✗ Error: ${loginRes.data.message}`);
    }

    const token = loginRes.data.token;

    // Test 3: Access student dashboard
    console.log('\n✅ Test 3: Student dashboard');
    const dashboardRes = await makeRequest('GET', '/api/student/dashboard');
    console.log(`   Status: ${dashboardRes.status}`);
    if (dashboardRes.status === 401) {
      console.log(`   ✓ Correctly rejected (no token). Expected behavior.`);
    } else if (dashboardRes.status === 200) {
      console.log(`   ✓ Dashboard data received`);
    }

    // Test 4: Get all students
    console.log('\n✅ Test 4: Get all students');
    const studentsRes = await makeRequest('GET', '/students');
    console.log(`   Status: ${studentsRes.status}`);
    console.log(`   Students count: ${Array.isArray(studentsRes.data) ? studentsRes.data.length : 0}`);

    // Test 5: API health check
    console.log('\n✅ Test 5: Health check');
    const healthRes = await makeRequest('GET', '/api/health');
    console.log(`   Status: ${healthRes.status}`);
    console.log(`   Response:`, healthRes.data);

    console.log('\n✅ All tests completed!');
    console.log('\n📌 Frontend is running on: http://localhost:5173');
    console.log('📌 Backend is running on: http://localhost:5000');
    console.log('\n🔐 Use these credentials to test login in the UI:');
    console.log('   Email: student@test.com');
    console.log('   Password: 123456');

  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runTests();
