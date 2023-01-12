const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
    photo: {
      type: String,
      default: "default_userPhoto.jpg",
    },
    password: {
      type: String,
    },
    access: {
      type: Boolean,
      default: true,
    },
    addresses: [
      {
        building: String,
        address: String,
        pincode: Number,
        country: String,
        contactNumber: Number,
        primary: Boolean,
      },
    ],
    cart: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
    },
    wishlist: {
      type: mongoose.Types.ObjectId,
      ref: "Wishlist",
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Orders",
      },
    ],
    couponsUsed: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Coupon",
      },
    ],
  },
  { timestamps: true }
);

const UserCLTN = mongoose.model("UserDetails", userSchema);

module.exports = UserCLTN;
