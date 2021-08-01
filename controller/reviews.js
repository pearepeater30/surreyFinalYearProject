const Review = require("../models/review");
const User = require("../models/user")
const Business = require("../models/business")

exports.createReview = (req, res, next) => {
  res.render("review/createReview", { title: "Reviews" });
};

exports.postReview = async (req, res, next) => {
  try{
    let {comment} = req.body
    const businessId = req.body.businessId;
    const userid = req.user._id;
    const user = await User.findById(userid);
    if (!comment) {
      req.flash('info', 'You need to type something in first');      
      res.redirect("/business/" + businessId)
    }
    else{
      const review = await Review({
        rating: req.body.rating,
        comment: req.body.comment,
        business: req.body.businessId,
        reviewCreator: userid,
        reviewCreatorName: user.name
      });
      review
        .save()
        .then(() => {
          res.redirect("/business/" + req.body.businessId)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
