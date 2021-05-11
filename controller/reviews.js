const Review = require("../models/review");
const User = require("../models/user")

exports.createReview = (req, res, next) => {
  res.render("review/createReview", { title: "Reviews" });
};

exports.postReview = async (req, res, next) => {
  const userid = req.user._id;
  const user = await User.findById(userid);
  const review = await Review({
    rating: req.body.rating,
    comment: req.body.comment,
    business: req.body.businessId,
    reviewCreator: userid,
    reviewCreatorName: user.name
  });
  review
    .save()
    .then((result) => {
      res.redirect("/business/" + req.body.businessId)
      console.log("Created Review");
    })
    .catch((err) => {
      console.log(err);
    });
};
