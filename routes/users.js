const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { forwardAuthenticated } = require("../config/auth");
const userController = require("../controller/users");

/* GET users listing. */
router.get("/login", forwardAuthenticated, userController.getLogin);

router.get("/register", forwardAuthenticated, userController.getRegister);

router.post("/register", userController.postUser);

router.post("/login", userController.postLogin);

router.get("/logout", userController.getLogout);
module.exports = router;
