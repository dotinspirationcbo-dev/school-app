const fs = require('fs');
const s = fs.readFileSync('server.js','utf8');
const idx = s.indexOf("/students");
console.log('found index', idx);
if (idx>=0){
  const snippet = s.slice(idx-10, idx+10);
  console.log('snippet:', snippet);
  console.log('char codes:', [...snippet].map(c=>c.charCodeAt(0)));
} else console.log('not found');
