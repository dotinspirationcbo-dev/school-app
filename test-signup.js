const http = require('http');

const data = JSON.stringify({
  fullName: 'Admin User',
  email: 'admin@school.com',
  password: '123456',
  role: 'admin'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (error) => console.error(error));
req.write(data);
req.end();
