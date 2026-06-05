const http = require('http');

const baseURL = 'http://localhost:5000';

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

    console.log(`[DEBUG] Making ${method} request to ${url.toString()}`);

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        console.log(`[DEBUG] Response status: ${res.statusCode}`);
        console.log(`[DEBUG] Response body: ${responseData}`);
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

async function test() {
  console.log('Testing signup endpoint...\n');
  
  const result = await makeRequest('POST', '/api/auth/signup', {
    fullName: 'John Doe',
    email: 'student@test.com',
    password: '123456',
    role: 'student'
  });

  console.log('\nResult:', result);
}

test().catch(console.error);
