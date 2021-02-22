const express = require("express");
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require("../models/user");
const { forwardAuthenticated } = require('../config/auth');

/* GET users listing. */
router.get("/login", forwardAuthenticated, (req, res, next) => {
  res.render("auth/login");
});

router.get("/register", forwardAuthenticated, (req, res, next) => {
  res.render("auth/register");
});

router.post("/register", (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Passwords don't match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Passwords shuold be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("auth/register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    const newUser = new User({
      name,
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save()
        .then(user => {
          console.log("Success")
          res.redirect('/users/login');
        })
        .catch(err => console.log(err));
      })
    }
    )}
});

router.post("/login", (req,res,next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/error',
    failureFlash: true
  })(req,res,next);
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
module.exports = router;
