const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    coin: { type: Number, default: 0 },
    energylevel: { type: String, enum: ['1', '2', '3','4','5'] ,default: '1'},
    multplyer: { type: Number, default: 1 },
  telegramId: String,
  referralCode: String,
  referredBy: String,
  referralCount: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
