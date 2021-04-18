const Review = require("../models/review");
const mongoose = require("mongoose");
const { ObjectID } = require("bson");

exports.createReview = (req, res, next) => {
  res.render("review/createReview", { title: "Write Review" });
};

exports.postReview = async (req, res, next) => {
  const review = await Review({
    rating: req.body.rating,
    comment: req.body.comment,
    business: req.body.businessId,
    reviewCreator: req.user._id,
  });
  review
    .save()
    .then((result) => {
      res.redirect("/businesses")
      console.log("Created Product");
    })
    .catch((err) => {
      console.log(err);
    });
};
