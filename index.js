
const {validate,parse}=require('@tma.js/init-data-node')
const express=require('express')
const cors=require('cors')
const connect = require("./connect");
const User=require('./Model/User')




// Secret bot token
const token = '7391685580:AAGbbqKx3sXuYgujCTIWz_0ce46YxZMsSPA';

// Middleware to set init data in the Response object


// Middleware to get init data from the Response object

// Middleware to authorize the external client
const authMiddleware = (req, res, next) => {
  
  const [authType, authData = ''] = (req.header('Authorization') || '').split(' ');

  if (authType ==='tma') {
    try {
      validate(authData,token,{ expiresIn: 3600 });
      req.initData = parse(authData);
    
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

const generatereferralCode = () => {
  return Math.random().toString(36).substring(2, 8);
}
app.get('/',authMiddleware,async (req, res) => {
const user=await User.findOne({telegramId:req.initData.user_id})
if(!user){
  const newUser=new User({
    telegramId:req.initData.user_id,
    referralCode:generatereferralCode(),
    referredBy:req.initData.startparams,
    referralCount:0
    
  })
  await newUser.save()
}

  return res.json({
    "Authenticated":true,
    "initData": req.initData,
    "user":user

  });
});
app.get('/myreferral',authMiddleware,async (req, res) => {
  const user=await User.findOne({telegramId:req.initData.user_id})
  const users=await User.find({referredBy:user.referralCode})
  return res.json({
    "users":users,

  });
});
app.post('/onclicks',authMiddleware,async (req, res) => {
  

  const user=await User.findOneAndUpdate({telegramId:req.initData.user_id},{$inc:{coin:Math.max(req.body.coin - (user?.coin || 0),0)}})

  return res.json({
    "user":user
  });
})

connect().then(() => {
  app.listen(3000,() => {
      console.log(`Example app listening at http://localhost:${3000}`);
  });
})