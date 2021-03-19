var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { getBusinesses, postBusinesses } = require('../controller/businesses');

router
  .route('/businesses')
  .get(getBusinesses)
  .post(postBusinesses)

module.exports = router;
