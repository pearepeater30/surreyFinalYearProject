const Business = require("../models/business");
const Review = require("../models/review");
const Reading = require("../models/reading");
const mongoose = require("mongoose");

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
  try {
    const business = await Business.create({
      businessName: req.body.businessName,
      businessOwner: req.user._id,
      address: req.body.address,
    });
    console.log("Created Business");
    res.redirect("/businesses");
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
  const businessId = req.params.businessId;
  try {
    const business = await Business.findById(businessId);
    const reviews = await Review.find({ business: businessId });
    // const co2Readings = await Reading.find( {} )
    res.render("business/business-detail", {
      business: business,
      title: business.title,
      reviews: reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.showEditBusiness = async (req, res, next) => {
  res.locals.currentUser = req.user;
  const businessId = req.params.businessId;
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
};

exports.postEditBusiness = async (req, res, next) => {
  try {
    const businessId = req.params.businessId;
    const business = Business.findById(businessId);
    await business.updateOne(
      { _id: businessId },
      {
        businessName: req.body.businessName,
        address: req.body.address,
        deviceNode: req.body.deviceNode,
      }
    );
    res.redirect("/yourbusinesses")
    // business.businessName = req.body.businessName;
    // business.address = req.body.address;
    // business.deviceNode = req.body.deviceNode;

    // await business.save()
    // .then(updatedBusiness => {
    //   console.log(updatedBusiness);
    // })
    // .else(err => {
    //   console.log(err);
    //   res.status(500).json({ error: "Server error" });

    // })
    // Business.findByIdAndUpdate({_id: req.params.businessId}, { businessName: req.body.businessName, address: req.body.address, deviceNode: req.body.deviceNode},function (model, err)
    // {
    //   if (err) {
    //     console.log(err);
    //     res.status(500).json({ error: "Server error" });
    //   }
    //   else{
    //     res.redirect("/yourbusinesses")
    //   }
    // })
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBusinessesList = async (req, res, next) => {
  res.locals.currentUser = req.user;
  try {
    const businesses = await Business.find({ businessOwner: req.user._id });
    res.render("business/businessList", {
      title: "Edit Business",
      businesses: businesses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
