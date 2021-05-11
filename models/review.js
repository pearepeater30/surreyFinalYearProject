const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: false,
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
  reviewCreatorName: {
    type: String,
    required: true,
  },
  creationTimeStamp: {
    type: Date,
    required: true,
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;