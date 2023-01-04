const express = require("express");
const router = express.Router();
const sessionCheck = require("../middlewares/user/sessionCheck");

router.get("/", (req, res) => {
  res.send("User login");
});

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
router.post("/profile", sessionCheck, profile.update);

const address = require("./../controllers/user/address");
router.get("/addresses", sessionCheck, address.viewAll);
router.post("/addresses/addNew", sessionCheck, address.addNew);
router.get("/addresses/delete", sessionCheck, address.deleteAddress);
router.get("/addresses/changeRole", sessionCheck, address.defaultToggler);

const cart = require("../controllers/user/cart");
router.get("/cart", sessionCheck, cart.viewAll);
router.get("/cart/addToCart/:id", sessionCheck, cart.addToCart);
router.get("/cart/removeFromCart/:id", sessionCheck, cart.remove);
router.get("/cart/reduceCount/:id", sessionCheck, cart.reduceCount);
router.get("/cart/addCount/:id", sessionCheck, cart.addCount);

const checkout = require("../controllers/user/checkout");
router
  .route("/cart/checkout")
  .get(sessionCheck, checkout.view)
  .put(sessionCheck, checkout.coupon)
  .post(sessionCheck,checkout.checkout);
router.post("/cart/checkout/changeDefaultAddress",sessionCheck, checkout.defaultAddress)

const wishlist = require("../controllers/user/wishlist");
router.get("/wishlist", sessionCheck, wishlist.viewAll);
router.get("/wishlist/addToWishlist/:id", sessionCheck, wishlist.addNew);
router.get('/wishlist/addToCart/:id', sessionCheck, wishlist.addToCart)
router.get("/wishlist/removeFromWishlist/:id", sessionCheck, wishlist.remove);

const orders = require("../controllers/user/orders");
router.get("/orders", sessionCheck, orders.viewAll);

const signOut = require("../controllers/user/signOut");
router.get("/signOut", signOut.signOut);

module.exports = router;