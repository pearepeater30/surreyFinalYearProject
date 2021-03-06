var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', function(req, res, next) {
  res.redirect('dashboard');
})

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('index', { title: 'Dashboard', currentUser: req.user});
});


module.exports = router;
