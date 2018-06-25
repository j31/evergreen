const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true}, 
  password: {type: String, required: true},
  isAdmin:  {type: Boolean, default: false},
  accountStatus: {type: String}, enum: ["pending", "confirmed"],
  knowledge: [],
  currentCategory: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
