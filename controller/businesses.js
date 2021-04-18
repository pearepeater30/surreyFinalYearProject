const Business = require("../models/business");
const Review = require("../models/review")
const mongoose = require('mongoose')

//Route to get the businesses from the databases
exports.getBusinesses = async (req, res, next) => {
  try {
    //populate business variable with business property and name of business owner
    const businesses = await Business.find().populate('businessOwner', 'name');
    
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
  try {
    const business = await Business.create({
      businessName: req.body.businessName,
      businessOwner: req.user._id ,
      address: req.body.address,
    });
    console.log("Created Business")
    res.redirect('/businesses')
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
exports.getBusiness = async (req,res,next) => {
  const businessId = req.params.businessId;
  try{
    const business = await Business.findById(businessId)
    const review = await Review.find({ business: (businessId)})
    res.render('business/business-detail', {
      business: business,
      pageTitle: business.title,
      reviews: review
    })
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }  
}
