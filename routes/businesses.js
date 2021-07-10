const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const {
  ensureBusinessOwner,
  ensureCustomer,
} = require("../middlewares/ensureUserType");
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

router.get(
  "/businesses",
  ensureAuthenticated,
  openBusinesses
);

router.get(
  "/getbusinesses",
  ensureAuthenticated,
  getBusinesses
);

router.get(
  "/createbusiness",
  ensureAuthenticated,
  ensureBusinessOwner,
  createBusinesses
);

router.post(
  "/businesses",
  ensureAuthenticated,
  ensureBusinessOwner,
  postBusinesses
);

router.get(
  "/business/:businessId",
  ensureAuthenticated,
  getBusiness
);

router.get(
  "/yourbusinesses",
  ensureAuthenticated,
  ensureBusinessOwner,
  getBusinessesList
);

router.get(
  "/editbusiness/:businessId",
  ensureAuthenticated,
  ensureBusinessOwner,
  showEditBusiness
);

router.post(
  "/editbusiness/:businessId",
  ensureAuthenticated,
  ensureBusinessOwner,
  postEditBusiness
);

router.get(
  "/getCO2Reading/:businessId",
  ensureAuthenticated,
  getCO2Reading
);

module.exports = router;
