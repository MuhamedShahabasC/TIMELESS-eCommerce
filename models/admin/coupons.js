const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    discount: Number,
    startingDate: Date,
    expiryDate: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
);

const couponCLTN = mongoose.model("Coupon", couponSchema);
module.exports = couponCLTN;
