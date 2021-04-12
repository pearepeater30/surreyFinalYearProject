const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  reviewCreator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;