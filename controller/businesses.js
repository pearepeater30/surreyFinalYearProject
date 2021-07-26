const Business = require("../models/business");
const Review = require("../models/review");
const Reading = require("../models/reading");
const mongoose = require("mongoose");
const geocoder = require("../util/geocoder");
const io = require("socket.io");

//Route to get the businesses from the databases
exports.getBusinesses = async (req, res, next) => {
  try {
    //populate business variable with business property and name of business owner
    const businesses = await Business.find().populate("businessOwner", "name");

    return res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//Route to post new businesses to the database
exports.postBusinesses = async (req, res, next) => {
  let errors = [];
  let { businessName, _id, address } = req.body;
  try {
    if (!businessName || !_id || !address) {
      errors.push({ msg: "One or more entries are not filled in properly" });
    }
    else if (errors.length > 0) {
      res.render("index", {
        title: "Home",
        errors: errors,
        currentUser: req.user,
      });
    } 
    else {
      const business = await Business.create({
        businessName: businessName,
        businessOwner: _id,
        address: address,
      });
      console.log("Created Business");
      res.redirect("/businesses");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.createBusinesses = (req, res, next) => {
  res.locals.currentUser = req.user;
  res.render("business/addBusiness", { title: "Add Business" });
};

//Route to open the map
exports.openBusinesses = async (req, res, next) => {
  try {
    res.locals.currentUser = req.user;
    res.render("business/overview", { title: "Overview" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//Route to display information about individual businesses
exports.getBusiness = async (req, res, next) => {
  res.locals.currentUser = req.user;
  const businessId = req.params.businessId;
  try {
    const business = await Business.findById(businessId);
    const reviews = await Review.find({ business: businessId });
    const co2FromDBReadings = await Reading.find({
      deviceNode: business.deviceNode,
    });
    const co2Readings = [];
    co2FromDBReadings.forEach((reading) => {
      co2Readings.push(reading.co2Reading);
    });
    const readingslength = co2Readings.length;
    const average = findingAverage(co2Readings, readingslength);
    const normalizedResults = SAXifier(co2Readings)
    console.log(normalizedResults)
    console.log(average)

    res.render("business/business-detail", {
      business: business,
      title: business.title,
      reviews: reviews,
      readingsAverage: parseFloat(average).toFixed(2),
      normalizedResult: normalizedResults[normalizedResults.length - 1]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.showEditBusiness = async (req, res, next) => {
  const businessId = req.params.businessId;
  business = await Business.find({_id: businessId, businessOwner: req.user._id})
  console.log(business)
  errors = []
  if (business.length == 0) {
    errors.push({ msg: "You do not have access to this" });
    res.render("index", {
      title: "Home",
      errors: errors,
      currentUser: req.user,
    });
  }
  else{
    res.locals.currentUser = req.user;
    try {
      const business = await Business.findById(businessId);
      res.render("business/editBusiness", {
        title: "Edit Business",
        business: business,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
};

exports.postEditBusiness = async (req, res, next) => {
  try {
    errors = []
    if (business.length == 0) {
      errors.push({ msg: "You do not have access to this" });
      res.render("index", {
        title: "Home",
        errors: errors,
        currentUser: req.user,
      });
    }
    else{
      res.locals.currentUser = req.user;
      const businessId = req.params.businessId;
      const business = Business.findById(businessId);
      console.log(req.body.address);
      const loc = await geocoder.geocode(req.body.address);
  
      await business.updateOne(
        { _id: businessId },
        {
          businessName: req.body.businessName,
          address: req.body.address,
          deviceNode: req.body.deviceNode,
          businessLocation: {
            type: "Point",
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress,
          },
        }
      );
      res.redirect("/yourbusinesses");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBusinessesList = async (req, res, next) => {
  res.locals.currentUser = req.user;
  try {
    const businesses = await Business.find({ businessOwner: req.user._id }).populate('businessOwner');
    res.render("business/businessList", {
      title: "Edit Business",
      businesses: businesses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


//** Helper methods */ 
const findingAverage = (array) => {
  this.array = array;
  var sum = 0;
  this.array.forEach((element) => {
    sum += element;
  });
  const total = sum / this.array.length;
  return total;
};

const SAXifier = (array) => {
  this.array = array;
  this.length = this.array.length;
  let SAXArray = []
  mean = findingAverage(this.array);
  stdev = findingstdev(this.array);
  this.array.forEach((element) => {
    value = (element-mean)/stdev
    console.log(value)
    if(value < -0.43) {
      SAXArray.push("a");
    }
    else if(value > 0.43) {
      SAXArray.push("c");
    }
    else{
      SAXArray.push("b");
    }
  })

  return (SAXArray);
}

const findingstdev = (array) => {
  this.array = array;
  const mean = findingAverage(this.array);
  var standardDev = 0;

  this.array.forEach((element) => {
    standardDev = ((element - mean)**2) + standardDev;
  })
  console.log("standard dev: " + standardDev/this.array.length)
  return (Math.sqrt(standardDev/this.array.length));
}
