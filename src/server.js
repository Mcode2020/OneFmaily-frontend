require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();

// ✅ Stripe webhook must use raw body parser BEFORE any JSON parser
app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

// ✅ Only after Stripe webhook, use JSON parser for other routes
app.use(express.json());
app.use(cors());
const subscriptionRoutes = require('./routes');
const webhookRoute = require('./webhook');

// Static route
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.status(500).send('Error loading index.html');
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
    }
  });
});

// ✅ Mount API routes
app.use('/api', subscriptionRoutes);
app.get('/api/test',(req,res)=>{
  res.status(200).json({message:"working"});
})
require('./config'); // this runs the DB connection code


// ✅ Mount webhook route at the correct path
app.use('/stripe/webhook', webhookRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
