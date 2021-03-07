const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login");
};

exports.getRegister = (req, res, next) => {
  res.render("auth/register");
};

exports.postUser = (req, res, next) => {
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
      password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            console.log("Success");
            res.redirect("/users/login");
          })
          .catch((err) => console.log(err));
      });
    });
  }
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
};

exports.getLogout = (req, res, next) => {
  req.logout();
  res.redirect("/users/login");
};
