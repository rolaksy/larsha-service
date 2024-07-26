// index.js
const express = require('express');
const app = express();
const userApi = require('./api/user');

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware to check the Origin or Referer header
const checkOrigin = (req, res, next) => {
  const allowedOrigin = 'http://localhost:3001';
  const origin = req.headers.origin || req.headers.referer;
  if (origin && (origin === allowedOrigin || origin.startsWith(allowedOrigin))) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

// Apply the middleware to your API routes
app.use('/api', checkOrigin);

//different apis
app.use('/api/users', userApi);

//normal index route
app.get('/', async (req, res) => {
  res.status(200).send("<h1>Server is UP</h1>");
});

//server start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
