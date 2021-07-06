const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const {
  getBusinesses,
  postBusinesses,
  openBusinesses,
  createBusinesses,
  getBusiness,
  showEditBusiness,
  postEditBusiness,
  getBusinessesList,
  getCO2Reading,
} = require("../controller/businesses");

router.get("/businesses", ensureAuthenticated, openBusinesses);

router.get("/getbusinesses", ensureAuthenticated, getBusinesses);

router.get("/createbusiness", ensureAuthenticated, createBusinesses);

router.post("/businesses", ensureAuthenticated, postBusinesses);

router.get("/business/:businessId", ensureAuthenticated, getBusiness);

router.get("/yourbusinesses", ensureAuthenticated, getBusinessesList);

router.get("/editbusiness/:businessId", ensureAuthenticated, showEditBusiness);

router.post("/editbusiness/:businessId", ensureAuthenticated, postEditBusiness);

router.get("/getCO2Reading/:businessId", ensureAuthenticated, getCO2Reading);

module.exports = router;
