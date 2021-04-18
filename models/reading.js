const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const readingSchema = new Schema({
  co2Reading: {
    type: Number,
    required: true
  },
  // business: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Business",
  //   required: true,
  // }
})

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;