const express = require("express");
const router = express.Router();
const sessionCheck = require("../middlewares/admin/sessionCheck");
const objectIdCheck = require("../middlewares/admin/objectIdCheck");

const signIn = require("../controllers/admin/signIn");
router.route("/").get(signIn.page).post(signIn.verification);

const customers = require("../controllers/admin/customers");
router
  .route("/customer_management")
  .get(sessionCheck, customers.viewAll)
  .patch(sessionCheck, customers.changeAccess);

const categories = require("../controllers/admin/category");
router.get("/categories", sessionCheck, categories.list);
router.post("/categories", sessionCheck, categories.addCategory);
router.get("/categories/edit", sessionCheck, categories.editPage);
router.post("/categories/edit", sessionCheck, categories.editCategory);
router.get(
  "/categories/delete_category",
  sessionCheck,
  categories.deleteCategory
);

const products = require("../controllers/admin/products");
const upload = require("../utilities/imageUpload");
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

router.get("/product_management/edit", sessionCheck, products.editPage);
router.post(
  "/product_management/edit",
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

const coupon = require("./../controllers/admin/coupons");
router.get("/coupon_management", sessionCheck, coupon.page);
router.post("/coupon_management/addNew", sessionCheck, coupon.addNew);
router.get(
  "/coupon_management/changeActivity",
  sessionCheck,
  coupon.changeActivity
);

const signOut = require("../controllers/admin/signOut");
router.get("/signOut", sessionCheck, signOut.signOut);

const dashboard = require("../controllers/admin/dashboard");
router
  .route("/dashboard")
  .get(sessionCheck, dashboard.view)
  .put(sessionCheck, dashboard.chartData);

const orders = require("../controllers/admin/orders");
router
  .route("/orders")
  .get(sessionCheck, orders.viewAll)
  .patch(sessionCheck, orders.deliver);
router.get("/orders/:id", objectIdCheck, orders.details);

const banner = require("../controllers/admin/banner");
router
  .route("/banner_management")
  .get(sessionCheck, banner.viewAll)
  .post(sessionCheck, upload.single("bannerImage"), banner.addNew)
  .patch(sessionCheck, banner.changeActivity)
  .delete(sessionCheck, banner.delete);

module.exports = router;
