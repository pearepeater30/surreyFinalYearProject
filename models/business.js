const mongoose = require("mongoose");
const { TRUE } = require("node-sass");

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  businessName: {
    type: String,
    required: true,
  },
  businessOwner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  businessLocation: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
  },
});

module.exports = mongoose.model("Business", businessSchema);
