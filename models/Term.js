const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const termSchema = new Schema({
  term: {type: String, required: true, unique: true}, 
  def: {type: String},
  cat: {type: String, required: true},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Term = mongoose.model('Term', termSchema);
module.exports = Term;

