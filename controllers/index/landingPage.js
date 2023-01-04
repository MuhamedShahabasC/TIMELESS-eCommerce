const productCLTN = require("../../models/admin/product");

const viewAll = async (req, res) => {
  const allProducts = await productCLTN.find().populate("category");
  res.render("index/landingPage", { allProducts });
};

module.exports = { viewAll };
