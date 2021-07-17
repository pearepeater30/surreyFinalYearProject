const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const {ensureCustomer} = require('../middlewares/ensureUserType')
const {postReview, createReview} = require("../controller/reviews");
const { post } = require("./businesses");

router.get("/createReview", ensureAuthenticated, ensureCustomer, createReview);

router.post("/postReview", ensureAuthenticated, ensureCustomer, postReview);

module.exports = router;
