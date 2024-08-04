// index.js
const express = require('express');
const app = express();
const cors = require('cors');
const userApi = require('./api/user');
const addressApi = require('./api/addressgrouper');

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());


//configuring cors
// Define a list of allowed origins
const allowedOrigins = [
  'http://localhost:3002', // Your local React app
  'https://rolaksy.github.io/', // Your deployed site
];

const corsOptions = {
  origin: function(origin, callback) {
    if(!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Access denied'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Force-Use']
};
app.use(cors(corsOptions));


// Middleware to check the Origin or Referer header
const checkOrigin = (req, res, next) => {
  const allowedOrigin = 'https://rolaksy.github.io/';
  const forceEntry = req.headers['x-api-force-use'];
  const origin = req.headers.origin || req.headers.referer;
  if (origin && (origin === allowedOrigin || origin.startsWith(allowedOrigin))) {
    next();
  } else if (forceEntry === "b02335fa-b42b-4fca-9a8f-4d90872069aa") {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

// Apply the middleware to your API routes
app.use('/api', checkOrigin);

//different apis
app.use('/api/ks/users', userApi);
app.use('/api/ks/address', addressApi);

//normal index route
app.get('/', async (req, res) => {
  res.status(200).send("<h1>Server is UP</h1>");
});

//server start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
