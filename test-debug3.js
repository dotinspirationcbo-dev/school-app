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

async function test() {
  console.log('Testing login endpoint...\n');
  
  const result = await makeRequest('POST', '/api/auth/login', {
    email: 'student@test.com',
    password: '123456'
  });

  console.log('Full response:', JSON.stringify(result, null, 2));
  console.log('\nChecking token path:');
  console.log('- result.data:', result.data);
  console.log('- result.data.token:', result.data.token);
  console.log('- result.data.data:', result.data.data);
  console.log('- result.data.data.token:', result.data.data ? result.data.data.token : 'N/A');
  console.log('- result.data.data.user:', result.data.data ? result.data.data.user : 'N/A');
}

test().catch(console.error);
