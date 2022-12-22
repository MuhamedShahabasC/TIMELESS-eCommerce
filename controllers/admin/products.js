const { findById } = require("../../models/admin/category");
const categoriesCLTN = require("../../models/admin/category");
const productCLTN = require("../../models/admin/product");

const page = async (req, res) => {
  const allCategories = await categoriesCLTN.find({});
  const allProducts = await productCLTN.find({});
  res.render("admin/partials/products", {
    documentTitle: "Product Management | TIMELESS",
    categories: allCategories,
    products: allProducts,
  });
};

const addProduct = async (req, res) => {
  const newProduct = new productCLTN({
    name: req.body.name,
    heroImage: req.file.filename,
    category: req.body.category,
    brand: req.body.brand,
    price: req.body.price,
    stock: req.body.stock,
    color: req.body.color,
  });
  await newProduct.save();
  console.log("Product added successfully");
  res.redirect("/admin/product_management");
};

const editPage = async (req, res) => {
  const currentProduct = await productCLTN.findById(req.query.id);
  const categories = await categoriesCLTN.find({});
  res.render("admin/partials/editProducts", {
    documentTitle: "Edit Product | TIMELESS",
    product: currentProduct,
    categories: categories,
  });
};

const edit = async (req, res) => {
  const currentProduct = await productCLTN.findById(req.query.id);
  await productCLTN.findByIdAndUpdate(currentProduct._id, {
    name: req.body.name,
    heroImage: req.file.filename,
    category: req.body.category,
    brand: req.body.brand,
    price: req.body.price,
    stock: req.body.stock,
    color: req.body.color,
  });
  console.log("Product edited successfully");
  res.redirect("/admin/product_management");
};

const changeListing = async (req, res) => {
  const currentProduct = await productCLTN.findById(req.query.id);
  let currentListing = currentProduct.listed;
  if (currentListing == true) {
    currentListing = false;
  } else {
    currentListing = true;
  }
  currentListing = Boolean(currentListing);
  await productCLTN.findByIdAndUpdate(currentProduct._id, {
    listed: currentListing,
  });
  res.redirect("/admin/product_management");
};

module.exports = {
  page,
  addProduct,
  editPage,
  edit,
  changeListing,
};
