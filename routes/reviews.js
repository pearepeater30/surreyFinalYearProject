const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const {postReview, createReview} = require("../controller/reviews");
const { post } = require("./businesses");

router.get("/createReview", ensureAuthenticated, createReview);

router.post("/postReview", ensureAuthenticated, postReview);

module.exports = router;
