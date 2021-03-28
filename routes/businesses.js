var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { getBusinesses, postBusinesses, openBusinesses, createBusinesses } = require('../controller/businesses');

router.get('/businesses', ensureAuthenticated, openBusinesses)

router.get('/getbusinesses', getBusinesses)

router.get('/createbusiness',ensureAuthenticated, createBusinesses)

router.post('/businesses', postBusinesses)


module.exports = router;
