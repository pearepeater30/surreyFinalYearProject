var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { getBusinesses, postBusinesses, openBusinesses } = require('../controller/businesses');

router.get('/businesses', openBusinesses)

router.get('/getbusinesses', getBusinesses)

router.post('/businesses', postBusinesses)


module.exports = router;
