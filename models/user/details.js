const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: Number,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  access: {
    type: Boolean,
    default: true,
  },
});

const UserCLTN = mongoose.model("UserDetails", userSchema);

module.exports = UserCLTN;
