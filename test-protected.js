const http = require('http');

// First, login to get token
const loginData = JSON.stringify({
  email: 'admin@school.com',
  password: '123456'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

console.log('🔐 Step 1: Logging in to get token...\n');

const loginReq = http.request(loginOptions, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    const loginResponse = JSON.parse(responseData);
    const token = loginResponse.token;
    
    console.log('✅ Login successful!');
    console.log('Token:', token, '\n');
    
    // Now test protected route WITHOUT token
    console.log('❌ Step 2: Trying to access /protected-students WITHOUT token...\n');
    
    const protectedOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/protected-students',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const protectedReq1 = http.request(protectedOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', data, '\n');
        
        // Now test WITH token
        console.log('✅ Step 3: Trying to access /protected-students WITH token...\n');
        
        const protectedOptions2 = {
          hostname: 'localhost',
          port: 5000,
          path: '/protected-students',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        
        const protectedReq2 = http.request(protectedOptions2, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            console.log('Status:', res.statusCode);
            console.log('Response:', data);
          });
        });
        
        protectedReq2.on('error', (error) => console.error('Error:', error));
        protectedReq2.end();
      });
    });
    
    protectedReq1.on('error', (error) => console.error('Error:', error));
    protectedReq1.end();
  });
});

loginReq.on('error', (error) => console.error('Error:', error));
loginReq.write(loginData);
loginReq.end();
