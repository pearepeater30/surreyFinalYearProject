const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const readingSchema = new Schema({
  co2Reading: {
    type: Number,
    required: true
  },
  deviceNode: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  }
})

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;