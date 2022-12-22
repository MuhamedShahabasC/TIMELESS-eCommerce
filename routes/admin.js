const express = require("express");
const router = express.Router();

const signIn = require("../controllers/admin/signIn");
router.get("/", signIn.signInPage);
router.post("/", signIn.adminVerification);

const customers = require("../controllers/admin/customers");
router.get("/customer_management", customers.List);
router.get("/customer_management/changeAccess", customers.changeAccess);

const categories = require("../controllers/admin/category");
router.get("/categories", categories.list);
router.post("/categories", categories.addCategory);
router.get("/categories/edit", categories.editPage);
router.post("/categories/edit", categories.editCategory);
router.get("/categories/delete_category", categories.deleteCategory);

const products = require("../controllers/admin/products");
const upload = require("../utilities/productImages");
router.get("/product_management", products.page);
router.post(
  "/product_management/add_product",
  upload.single("HeroImage"),
  products.addProduct
);
router.get("/product_management/edit", products.editPage);
router.post(
  "/product_management/edit",
  upload.single("HeroImage"),
  products.edit
);
router.get("/product_management/changeListing", products.changeListing);

const signOut = require("../controllers/admin/signOut");
router.get("/signOut", signOut.signOut);

// Temp dashboard
router.get("/dashboard", (req, res) => {
  res.send("This is dashboard");
});

// Temp Orders
router.get("/orders", (req, res) => {
  res.send("Order Page");
});

// Temp Coupons
router.get("/coupons", (req, res) => {
  res.send("Coupons Page");
});

module.exports = router;
