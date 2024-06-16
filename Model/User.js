const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  telegramId: String,
  referralCode: String,
  referredBy: String,
  referralCount: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
