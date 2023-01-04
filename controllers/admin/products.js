const { default: mongoose } = require("mongoose");
const { findById } = require("../../models/admin/category");
const categoriesCLTN = require("../../models/admin/category");
const productCLTN = require("../../models/admin/product");

const page = async (req, res) => {
  try {
    const allCategories = await categoriesCLTN.find({});
    const allProducts = await productCLTN.find().populate("category");
    res.render("admin/partials/products", {
      documentTitle: "Product Management | TIMELESS",
      categories: allCategories,
      products: allProducts,
    });
  } catch (error) {
    console.log("Product Page rendering error: " + error);
  }
};

const addProduct = async (req, res) => {
  try {
    const newImages = [
      req.files.images[0].filename,
      req.files.images[1].filename,
      req.files.images[2].filename,
    ];
    const newProduct = new productCLTN({
      name: req.body.name,
      heroImage: req.files.heroImage[0].filename,
      category: mongoose.Types.ObjectId(req.body.categoryID),
      images: newImages,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      color: req.body.color,
      referenceNumber: req.body.refNumber,
      modelCase: req.body.modelCase,
      waterResistance: req.body.waterRes,
      movement: req.body.movement,
      powerReserve: req.body.powerRes,
      bracelet: req.body.bracelet,
    });
    await newProduct.save();
    console.log("Product added successfully");
    res.redirect("/admin/product_management");
  } catch (error) {
    console.log("Product adding error: " + error);
  }
};

const editPage = async (req, res) => {
  try {
    const currentProduct = await productCLTN.findById(req.query.id);
    const categories = await categoriesCLTN.find({});
    res.render("admin/partials/editProducts", {
      documentTitle: "Edit Product | TIMELESS",
      product: currentProduct,
      categories: categories,
    });
  } catch (error) {
    console.log("Product editing GET error: " + error);
  }
};

const edit = async (req, res) => {
  try {
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
  } catch (error) {
    console.log("Product editing POST error: " + error);
  }
};

const changeListing = async (req, res) => {
  try {
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
  } catch (error) {
    console.log("Product listing changing error: " + error);
  }
};

module.exports = {
  page,
  addProduct,
  editPage,
  edit,
  changeListing,
};
