const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const readingSchema = new Schema({
  co2Reading: {
    type: Number,
    required: false
  },
  totalPeople:{
    type: Number,
    required: false
  },
  maskedPeople: {
    type: Number,
    required: false
  },
  deviceNode: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;