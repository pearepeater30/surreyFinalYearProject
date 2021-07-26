const mongoose = require("mongoose");
const geocoder = require('../util/geocoder')

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
  deviceNode: {
    type: String,
    required: false,
  }
});

//Geocoder & Create Location
businessSchema.pre('save', async function(next) {
  //get location from geocoder middleware
  const loc = await geocoder.geocode(this.address)
  .catch((e) => {
    console.log("error geocoding")
  }) ;
  //set the businesslocation field in the schema
  this.businessLocation = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  }
  next();
});

module.exports = mongoose.model("Business", businessSchema);
