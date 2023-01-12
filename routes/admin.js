const express = require("express");
const router = express.Router();
const sessionCheck = require("../middlewares/admin/sessionCheck");
const objectIdCheck = require("../middlewares/admin/objectIdCheck");

const signIn = require("../controllers/admin/signIn");
router.route("/").get(signIn.page).post(signIn.verification);

const customers = require("../controllers/admin/customers");
router
  .route("/customer_management")
  .get(customers.viewAll)
  .patch(customers.changeAccess);

const categories = require("../controllers/admin/category");
router.get("/categories", categories.list);
router.post("/categories", categories.addCategory);
router.get("/categories/edit", categories.editPage);
router.post("/categories/edit", categories.editCategory);
router.get("/categories/delete_category", categories.deleteCategory);

const products = require("../controllers/admin/products");
const upload = require("../utilities/imageUpload");
router.get("/product_management", products.page);
router.post(
  "/product_management/add_product",
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  products.addProduct
);

router.get("/product_management/edit", products.editPage);
router.post(
  "/product_management/edit",
  upload.single("heroImage"),
  products.edit
);
router.get("/product_management/changeListing", products.changeListing);

const coupon = require("./../controllers/admin/coupons");
router.get("/coupon_management", coupon.page);
router.post("/coupon_management/addNew", coupon.addNew);
router.get("/coupon_management/changeActivity", coupon.changeActivity);

const signOut = require("../controllers/admin/signOut");
router.get("/signOut", signOut.signOut);

// Temp dashboard
router.get("/dashboard", (req, res) => {
  res.redirect("/admin/coupon_management");
});

const orders = require("../controllers/admin/orders");
router.route("/orders").get(orders.viewAll).patch(orders.deliver);
router.get("/orders/:id", objectIdCheck, orders.details);

const banner = require("../controllers/admin/banner");
router
  .route("/banner_management")
  .get(banner.viewAll)
  .post(upload.single("bannerImage"), banner.addNew)
  .patch(banner.changeActivity)
  .delete(banner.delete);

module.exports = router;
