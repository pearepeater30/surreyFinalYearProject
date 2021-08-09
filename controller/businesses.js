const Business = require("../models/business");
const Review = require("../models/review");
const Reading = require("../models/reading");
const geocoder = require("../util/geocoder");

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
  let { businessName, address } = req.body;
  let errors = [];
  //error checking
  try {
    if (!businessName || !address) {
      errors.push({ msg: "One or more entries are not filled in properly" });
    }
    //show errors
    if (errors.length > 0) {
      res.render("index", {
        title: "Home",
        errors: errors,
        currentUser: req.user,
      });
    } else {
      await Business.create({
        businessName: businessName,
        businessOwner: req.user._id,
        address: address,
      });
      console.log("Created Business");
      res.redirect("/businesses");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

//Route to open form to create business
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
    //get data from the database
    const business = await Business.findById(businessId);
    const reviews = await Review.find({ business: businessId });
    //find reading belonging to the device node of the business
    const co2FromDBReadings = await Reading.find({
      deviceNode: business.deviceNode,
    });
    const co2Readings = [];
    const peoplewhomstEnter = [];
    const maskedpeoplewhomstEnter = [];
    //iterate through each reading
    co2FromDBReadings.forEach((reading) => {
      co2Readings.push(reading.co2Reading);
      peoplewhomstEnter.push(reading.totalPeople);
      maskedpeoplewhomstEnter.push(reading.maskedPeople);
    });
    let ratio;
    let co2Average;
    let normalizedResults = [];
    let peopleWhoEnter = [];
    console.log(peoplewhomstEnter);
    console.log(maskedpeoplewhomstEnter);
    //calculate the normalized results
    normalizedResults.push(SAXifier(co2Readings)[co2Readings.length-1]);
    normalizedResults.push(SAXifier(peoplewhomstEnter)[peoplewhomstEnter.length-1]);
    //sum up all the values in the arrays
    peopleWhoEnter.push(peoplewhomstEnter.reduce((a, b) => a + b, 0))
    peopleWhoEnter.push(maskedpeoplewhomstEnter.reduce((a, b) => a + b, 0))
    //average values
    co2Average = findingAverage(co2Readings);
    //calculate percentage of masked people vs non-masked people
    ratio = ((maskedpeoplewhomstEnter)[maskedpeoplewhomstEnter.length-1] / (peoplewhomstEnter)[peoplewhomstEnter.length-1]) * 100
    //render the page
    res.render("business/business-detail", {
      business: business,
      title: business.businessName,
      peopleWhoEnter: peopleWhoEnter,
      normalizedResults: normalizedResults,
      reviews: reviews,
      co2Average: co2Average.toFixed(2),
      ratio: ratio.toFixed(2)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//Route to show form to edit business
exports.showEditBusiness = async (req, res, next) => {
  const businessId = req.params.businessId;
  //see if the business the user is trying to edit belongs to the currently logged in user
  business = await Business.find({
    _id: businessId,
    businessOwner: req.user._id,
  });
  errors = [];
  //show warning if it doesn't
  if (business.length == 0) {
    errors.push({ msg: "You do not have access to this" });
    res.render("index", {
      title: "Home",
      errors: errors,
      currentUser: req.user,
    });
  } else {
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

//Route to post edit business request
exports.postEditBusiness = async (req, res, next) => {
  res.locals.currentUser = req.user;
  let { businessName, address } = req.body;
  const businessId = req.params.businessId;
  const business = Business.findById(businessId);
  console.log(req.body.address);
  const loc = await geocoder.geocode(req.body.address);
  let errors = [];
  //error checking
  try {
    if (!businessName || !address) {
      errors.push({ msg: "One or more entries are not filled in properly" });
    }
    //show errors
    if (errors.length > 0) {
      res.render("index", {
        title: "Home",
        errors: errors,
        currentUser: req.user,
      });
    } 
    //update business
    else {
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
    }
    res.redirect("/yourbusinesses");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBusinessesList = async (req, res, next) => {
  res.locals.currentUser = req.user;
  //get all the businesses belonging to the currently logged in user
  try {
    const businesses = await Business.find({
      businessOwner: req.user._id,
    }).populate("businessOwner");
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
  let SAXArray = [];
  mean = findingAverage(this.array);
  stdev = findingstdev(this.array);
  this.array.forEach((element) => {
    value = (element - mean) / stdev;
    console.log(value);
    if (value < -0.67) {
      SAXArray.push("a");
    } else if (value <= 0 || isNaN(value)) {
      SAXArray.push("b");
    } else if (value > 0.67) {
      SAXArray.push("d");
    } else {
      SAXArray.push("c");
    }
  });
  console.log(SAXArray)
  return SAXArray;
};

const findingstdev = (array) => {
  this.array = array;
  const mean = findingAverage(this.array);
  var standardDev = 0;
  this.array.forEach((element) => {
    standardDev = (element - mean) ** 2 + standardDev;
  });
  return Math.sqrt(standardDev / this.array.length);
};

