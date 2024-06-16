const { validate, parse } = require('@tma.js/init-data-node');
const express = require('express');
const cors = require('cors');

// Secret bot token
const token = '7391685580:AAGbbqKx3sXuYgujCTIWz_0ce46YxZMsSPA';

// Create an Express app
const app = express();

// Use CORS middleware to allow requests from your client
app.use(cors());

// Middleware to authorize the external client
const authMiddleware = (req, res, next) => {
  console.log(req.header('Authorization'), 'authorization');
  const [authType, authData = ''] = (req.header('Authorization') || '').split(' ');

  if (authType === 'tma') {
    try {
      validate(authData, token, { expiresIn: 3600 });
      req.locals = { initData: parse(authData) };
      return next();
    } catch (e) {
      console.log(e);
      return res.status(401).send(e.message + ' ' + authData);
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Define the route with the auth middleware
app.get('/', authMiddleware, (req, res) => {
  return res.json({
    dat: "jj",
    initData: req.locals.initData
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
