const express = require("express");
const router = express.Router();
const sessionCheck = require("../middlewares/admin/sessionCheck");
const objectIdCheck = require("../middlewares/admin/objectIdCheck");
const signIn = require("../controllers/admin/signIn");
const customers = require("../controllers/admin/customers");
const categories = require("../controllers/admin/category");
const products = require("../controllers/admin/products");
const upload = require("../utilities/imageUpload");
const coupon = require("./../controllers/admin/coupons");
const dashboard = require("../controllers/admin/dashboard");
const orders = require("../controllers/admin/orders");
const banner = require("../controllers/admin/banner");
const salesReport = require("../utilities/salesReport");
const signOut = require("../controllers/admin/signOut");

// Sign In
router
  .route("/")
  .get(signIn.page)
  .post(signIn.verification);

// Customer Management
router
  .route("/customer_management")
  .get(sessionCheck, customers.viewAll)
  .patch(sessionCheck, customers.changeAccess);

// Category Management
router
  .route("/categories")
  .get(sessionCheck, categories.list)
  .post(sessionCheck, categories.addCategory);
router
  .route("/categories/edit")
  .get(sessionCheck, categories.editPage)
  .post(sessionCheck, categories.editCategory);
router
  .route("/categories/delete_category")
  .get(sessionCheck,categories.deleteCategory);

// Product Management
router.get("/product_management", sessionCheck, products.page);
router.post(
  "/product_management/add_product",
  sessionCheck,
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  products.addProduct
);
router
  .route("/product_management/edit")
  .get(sessionCheck, products.editPage)
  .post(
    sessionCheck,
    upload.fields([
      { name: "frontImage", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 3 },
    ]),
    products.edit
  );
router.get(
  "/product_management/changeListing",
  sessionCheck,
  products.changeListing
);

// Coupon Management
router.get("/coupon_management", sessionCheck, coupon.page);
router.post("/coupon_management/addNew", sessionCheck, coupon.addNew);
router.get(
  "/coupon_management/changeActivity",
  sessionCheck,
  coupon.changeActivity
);

// Dashboard
router
  .route("/dashboard")
  .get(sessionCheck, dashboard.view)
  .put(sessionCheck, dashboard.chartData);

// Order Management
router
  .route("/orders")
  .get(sessionCheck, orders.viewAll)
  .patch(sessionCheck, orders.deliver);
router
  .route("/orders/:id")
  .get(objectIdCheck, orders.details);

// Banner Management
router
  .route("/banner_management")
  .get(sessionCheck, banner.viewAll)
  .post(sessionCheck, upload.single("bannerImage"), banner.addNew)
  .patch(sessionCheck, banner.changeActivity)
  .delete(sessionCheck, banner.delete);

// Sales Report
router.route("/salesReport").get(salesReport.download);

// Sign Out
router
  .route("/signOut")
  .get(sessionCheck, signOut.signOut);

module.exports = router;
