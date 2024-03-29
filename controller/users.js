const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", { title: "Login" });
};

exports.getRegister = (req, res, next) => {
  res.render("auth/register", { title: "Register" });
};

exports.postUser = (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  //usertype stored as a variable, to modify to boolean
  var usertype = req.body.usertype;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords don't match" });
  }

  if (password.length < 8) {
    errors.push({ msg: "Passwords should be at least 8 characters" });
  }
  //modify usertype to boolean values instead of string
  if (usertype === "True") {
    usertype = true;
  } else if (usertype === "False") {
    usertype = false;
  }
  if (errors.length > 0) {
    res.render("auth/register", {
      errors,
      name,
      email,
      password,
      password2,
      usertype,
      title: "Register",
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("auth/register", {
          errors,
          name,
          email,
          password,
          password2,
          usertype,
          title: "Register",
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          usertype,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                console.log("Success");
                req.login(user, function (err) {
                  if (!err) {
                    res.redirect("/");
                  } else {
                    res.render("auth/register", {
                      errors,
                      currentUser: req.user,
                      title: "Home"
                    });
                  }
                });
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
};

exports.postLogin = (req,res,next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req,res,next)
};

exports.getLogout = (req, res, next) => {
  req.logout();
  res.redirect("/users/login");
};
