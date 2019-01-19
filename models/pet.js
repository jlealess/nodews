const mongoose = require('mongoose');
const { Schema } = mongoose;

const PetSchema = new Schema({
  name: String,
  photo: String,
  description: String,
  score: Number
});

module.exports = mongoose.model('Pet', PetSchema);

