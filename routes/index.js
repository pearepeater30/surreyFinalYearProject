var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', function(req, res, next) {
  res.redirect('/users/login', {title: 'Login'});
})

/* GET home page. */
router.get('/dashboard', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Dashboard' });
});

module.exports = router;
