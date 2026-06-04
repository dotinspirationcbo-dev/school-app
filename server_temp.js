const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => res.send('temp server')); 
app.post('/students', (req, res) => res.status(201).json(req.body));
app.listen(5001, () => console.log('temp server running on 5001'));
