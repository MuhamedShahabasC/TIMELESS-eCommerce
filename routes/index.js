const express = require("express");
const { default: mongoose } = require("mongoose");
const UserCLTN = require("../models/user/details");
const router = express.Router();

router.get("/", async (req, res) => {
  let currentUser = null;
  if (req.session.userID) {
    currentUser = await UserCLTN.findById(req.session.userID);
  }
  res.render("index/landingPage", {
    session: req.session.userID,
    currentUser,
  });
});

const product = require("./../controllers/index/product");
router.get("/products/:id", product.view);

router.get("/men", (req, res) => {
  res.render("index/categoryPage");
});

module.exports = router;
