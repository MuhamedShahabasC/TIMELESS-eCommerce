const express = require("express");
const router = express.Router();
const sessionCheck = require("../middlewares/user/sessionCheck");
const objectIdCheck = require("../middlewares/user/objectIdCheck");
const imageUpload = require("../utilities/imageUpload");
const imageProcessor = require("../utilities/imageProcessor");

const signUp = require("../controllers/user/signUp");
router.get("/signUp", signUp.signUpPage);
router.post("/signUp", signUp.registerUser);
router.get("/otp_verification", signUp.otpPage);
router.post("/otp_verification", signUp.otpVerification);

const signIn = require("../controllers/user/signIn");
router.get("/signIn", signIn.signInPage);
router.post("/signIn", signIn.userVerification);

const forgotPassword = require("../controllers/user/forgotPassword");
router.get("/forgotPassword", forgotPassword.Page);
router.post("/forgotPassword", forgotPassword.emailVerification);
router.get("/forgotPassword/otpVerification", forgotPassword.otpPage);
router.get(
  "/forgotPassword/otpVerification/resend_OTP",
  forgotPassword.emailVerification
);
router.post("/forgotPassword/otpVerification", forgotPassword.otpVerification);
router.get("/changePassword", forgotPassword.passwordChangePage);
router.post("/changePassword", forgotPassword.updatePassword);

const profile = require("../controllers/user/profile");
router.get("/profile", sessionCheck, profile.page);
router.post(
  "/profile",
  sessionCheck,
  imageUpload.single("photo"),
  imageProcessor.userProfilePic,
  profile.update
);

const address = require("./../controllers/user/address");
router.get("/addresses", sessionCheck, address.viewAll);
router.post("/addresses/addNew", sessionCheck, address.addNew);
router.get("/addresses/delete", sessionCheck, address.deleteAddress);
router.get("/addresses/changeRole", sessionCheck, address.defaultToggler);

const cart = require("../controllers/user/cart");
router.get("/cart", sessionCheck, cart.viewAll);
router
  .route("/cart/count")
  .put(sessionCheck, cart.addCount)
  .delete(sessionCheck, cart.reduceCount);

router.get("/cart/addToCart/:id", sessionCheck, objectIdCheck, cart.addToCart);
router.get(
  "/cart/removeFromCart/:id",
  sessionCheck,
  objectIdCheck,
  cart.remove
);

const checkout = require("../controllers/user/checkout");
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
router.get("/cart/checkout/:id", sessionCheck, checkout.result);

const wishlist = require("../controllers/user/wishlist");
router
  .route("/wishlist")
  .get(sessionCheck, wishlist.viewAll)
  .patch(wishlist.addOrRemove)
  .delete(wishlist.remove);

const orders = require("../controllers/user/orders");
router.get("/orders", sessionCheck, orders.viewAll);
router.get("/orders/:id", sessionCheck, objectIdCheck, orders.details);

const reviews = require("../controllers/user/reviews");
router
  .route("/reviews")
  .post(sessionCheck, reviews.addNew)
  .patch(reviews.helpful);

const signOut = require("../controllers/user/signOut");
router.get("/signOut", sessionCheck, signOut.signOut);

module.exports = router;
