var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { getBusinesses } = require('../controller/businesses');

router
  .route('/businesses')
  .get(getBusinesses)

module.exports = router;
