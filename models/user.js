const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  /** TODO might need to add a different user type. 
   *  True is a Business Owner,
   *  False is a Customer
  */
  usertype: {
    type: Boolean,
    required: true
  }
});

const User = mongoose.model ('User', userSchema)

module.exports = User;