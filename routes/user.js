const express = require("express");
const router = express.Router();
const sessionCheck = require("../middlewares/user/sessionCheck");
const objectIdCheck = require("../middlewares/user/objectIdCheck");
const imageUpload = require("../utilities/imageUpload");
const imageProcessor = require("../utilities/imageProcessor");
const signUp = require("../controllers/user/signUp");
const signIn = require("../controllers/user/signIn");
const forgotPassword = require("../controllers/user/forgotPassword");
const profile = require("../controllers/user/profile");
const address = require("./../controllers/user/address");
const cart = require("../controllers/user/cart");
const checkout = require("../controllers/user/checkout");
const wishlist = require("../controllers/user/wishlist");
const orders = require("../controllers/user/orders");
const reviews = require("../controllers/user/reviews");
const signOut = require("../controllers/user/signOut");

// Sign Up
router
  .route("/signUp")
  .get(signUp.signUpPage)
  .post(signUp.registerUser);
router
  .route("/otp_verification")
  .get(signUp.otpPage)
  .post(signUp.otpVerification);

// Sign In
router
  .route("/signIn")
  .get(signIn.signInPage)
  .post(signIn.userVerification);

// Password Handlers
router
  .route("/forgotPassword")
  .get(forgotPassword.Page)
  .post(forgotPassword.emailVerification);
router.get("/forgotPassword/otpVerification", forgotPassword.otpPage);
router.get(
  "/forgotPassword/otpVerification/resend_OTP",
  forgotPassword.emailVerification
);
router.post("/forgotPassword/otpVerification", forgotPassword.otpVerification);
router
  .route("/changePassword")
  .get(forgotPassword.passwordChangePage)
  .post(forgotPassword.updatePassword);

// Profile
router
  .route("/profile")
  .get(sessionCheck, profile.page)
  .post(
    sessionCheck,
    imageUpload.single("photo"),
    imageProcessor.userProfilePic,
    profile.update
  );

// Addresses
router.get("/addresses", sessionCheck, address.viewAll);
router.post("/addresses/addNew", sessionCheck, address.addNew);
router.get("/addresses/delete", sessionCheck, address.deleteAddress);
router.get("/addresses/changeRole", sessionCheck, address.defaultToggler);

// Wishlist
router
  .route("/wishlist")
  .get(sessionCheck, wishlist.viewAll)
  .patch(wishlist.addOrRemove)
  .delete(wishlist.remove);

// Cart
router
  .route("/cart")
  .get(sessionCheck, cart.viewAll)
  .post(sessionCheck, cart.addToCart)
  .delete(sessionCheck, cart.remove);
router
  .route("/cart/count")
  .put(sessionCheck, cart.addCount)
  .delete(sessionCheck, cart.reduceCount);

// Checkout
router
  .route("/cart/checkout")
  .get(sessionCheck, checkout.view)
  .put(sessionCheck, checkout.coupon)
  .post(sessionCheck, checkout.checkout);
router.post(
  "/cart/checkout/changeDefaultAddress",
  sessionCheck,
  checkout.defaultAddress
);
router.get("/cart/checkout/:id",  checkout.result);

// Orders
router.get("/orders", sessionCheck, orders.viewAll);
router
  .route("/orders/:id")
  .get(sessionCheck, objectIdCheck, orders.details)
  .patch(sessionCheck, objectIdCheck, orders.cancel);

// Reviews
router
  .route("/reviews")
  .post(sessionCheck, reviews.addNew)
  .patch(reviews.helpful);

// Sign out
router.get("/signOut", sessionCheck, signOut.signOut);

module.exports = router;
