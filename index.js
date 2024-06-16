
const {validate,parse}=require('@tma.js/init-data-node')
const express=require('express')
const cors=require('cors')
const TelegramBot = require('node-telegram-bot-api');
const connect = require("./connect");
const User = require('./Model/User'); 



// Secret bot token
const token = '7391685580:AAGbbqKx3sXuYgujCTIWz_0ce46YxZMsSPA';
const bot = new TelegramBot(token, { polling: true });
// Generate a unique referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex');
};

// Start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const referrerCode = msg.text.split(' ')[1];  // Get the referral code from the URL

  let user = await User.findOne({ telegramId: chatId });

  if (!user) {
    const referralCode = generateReferralCode();
    user = new User({
      username: msg.chat.username,
      telegramId: chatId,
      referralCode: referralCode,
      referredBy: referrerCode || null,
    });

    if (referrerCode) {
      const referrer = await User.findOne({ referralCode: referrerCode });
      if (referrer) {
        referrer.referralCount += 1;
        await referrer.save();
      }
    }

    await user.save();
    bot.sendMessage(chatId, `Welcome! Your referral code is: ${referralCode}`);
  } else {
    bot.sendMessage(chatId, `Welcome back! Your referral code is: ${user.referralCode}`);
  }
});


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


app.get('/',authMiddleware, (req, res) => {
  return res.json({
    "dat":"jj",
    "initData": req.initData
  });
});

connect().then(() => {
  app.listen(3000,() => {
      console.log(`Example app listening at http://localhost:${3000}`);
  });
})