const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const evergreenSchema = new Schema({
  user: {type: String, required: true, unique: true}, 
  dict: {type: String, required: true},
  knowledgeOutput: String,
  state: {type: String, default: "home"},
  score: {type: Number, default: 0},
  knowledgeTerm: {},
  question: String,
  answer: String,
  questionNum: {type: Number, default: 0},
  gameClock: {type: Number, default: 0},
  gameScore: {type: Number, default: 0},
  intervalId: {type: Number, default: 0},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Evergreen = mongoose.model('Evergree ', evergreenSchema);
module.exports = Evergreen;

