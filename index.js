
const {validate,parse}=require('@tma.js/init-data-node')
const express=require('express')
const cors=require('cors')


// Secret bot token
const token = '1234567890:ABC';

// Middleware to set init data in the Response object
function setInitData(res, initData) {
  res.locals.initData = initData;
}

// Middleware to get init data from the Response object
function getInitData(res) {
  return res.locals.initData;
}

// Middleware to authorize the external client
const authMiddleware = (req, res, next) => {
  const [authType, authData = ''] = (req.header('authorization') || '').split(' ');

  if (authType === 'tma') {
    try {
      validate(authData, token, { expiresIn: 3600 });
      setInitData(res, parse(authData));
      return next();
    } catch (e) {
      return next(e);
    }
  } else {
    return next(new Error('Unauthorized'));
  }
};

// Middleware to show the user init data
const showInitDataMiddleware = (req, res, next) => {
  const initData = getInitData(res);
  if (!initData) {
    return next(new Error('Cannot display init data as it was not found'));
  }
  console.log(initData)
  res.json(initData);
};

// Error handling middleware
const defaultErrorMiddleware = (err, req, res, next) => {
  res.status(500).json({ error: err.message });
};

// Create an Express app and start listening on port 3000
const app = express();
app.use(cors())

app.use(authMiddleware);
app.get('/', showInitDataMiddleware);
app.use(defaultErrorMiddleware);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
