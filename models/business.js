const mongoose = require("mongoose");
const geocoder = require('../util/geocoder')

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  businessName: {
    type: String,
    required: true,
  },
  businessOwner: {
    type: String, //Schema.Types.ObjectId
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

//Geocoder & Create Location
businessSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  console.log(loc);
});

module.exports = mongoose.model("Business", businessSchema);
