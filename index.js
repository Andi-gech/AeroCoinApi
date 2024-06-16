
const {validate,parse}=require('@tma.js/init-data-node')
const express=require('express')
const cors=require('cors')


// Secret bot token
const token = '7391685580:AAGbbqKx3sXuYgujCTIWz_0ce46YxZMsSPA';

// Middleware to set init data in the Response object


// Middleware to get init data from the Response object

// Middleware to authorize the external client
const authMiddleware = (req, res, next) => {
  console.log(req.header('authorization'),'authorization')
  const [authType, authData = ''] = (req.header('Authorization') || '').split(' ');

  if (authType === 'tma') {
    try {
      validate(authData, token, { expiresIn: 3600 });
      req.locals.initData = parse(authData);
    
      return next();
    } catch (e) {
      console.log(e)
      return res.send(e.message+' '+authData);
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Middleware to show the user init data


// Error handling middleware

// Create an Express app and start listening on port 3000
const app = express();
app.use(cors())


app.get('/',authMiddleware, (req, res) => {
  return res.json({
    "dat":"jj",
    "initData": req.locals.initData
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
