const http = require('http');

const data = JSON.stringify({ fullName: 'John Doe', class: 'S1', age: 15, parentContact: '0771234567' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/students',
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

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
