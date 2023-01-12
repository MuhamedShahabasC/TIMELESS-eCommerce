const categoryCLTN = require("../../models/admin/category");
const productCLTN = require("../../models/admin/product");

let listing;
// let listingName;
exports.ourCollection = async (req, res) => {
  listingName = "Our Collection";
  if (!listing) {
    listing = await productCLTN.find({ listed: true });
  }
  res.render("index/productListing", {
    listing,
    documentTitle: "TIMELESS",
    listingName,
  });
};

let filtered;
exports.current = async (req, res) => {
  let currentFilter;
  let allProducts;
  if (!listing) {
    allProducts = await productCLTN.find({ listed: true });
  } else {
    allProducts = listing;
  }
  switch (req.body.filterBy) {
    case "men":
      currentFilter = allProducts.filter(
        (product) => product.category == "63a051ff7b36d782859a1e3e"
      );
      break;
    case "women":
      currentFilter = allProducts.filter(
        (product) => product.category == "63a0523eceb514042442b2f4"
      );
      break;
    case "none":
      currentFilter = null;
      break;
    default:
      console.log("default switch case of filter");
  }
  listing = currentFilter;
  filtered = currentFilter;
  if (!currentFilter) {
    res.json({
      success: 0,
    });
  } else {
    res.json({
      success: 1,
    });
  }
};

exports.search = async (req, res) => {
  let searchResult = [];
  if (filtered) {
    const regex = new RegExp(req.body.searchInput, "i");
    filtered.map((product) => {
      if (regex.exec(product.name)) {
        searchResult.push(product);
      }
    });
  } else {
    searchResult = await productCLTN.find({
      name: {
        $regex: req.body.searchInput,
        $options: "i",
      },
      listed: true,
    });
  }
  listing = searchResult;
  res.json({
    success: 1,
  });
};

exports.categories = async (req, res) => {
  if (req.params.id == "newReleases") {
    const products = await productCLTN.find().sort({ _id: -1 });
    res.render("index/productListing", {
      listing: products,
      documentTitle: `New Releases | TIMELESS`,
      listingName: "New Releases",
    });
  } else {
    const currentCategory = await categoryCLTN.findById(req.params.id);
    const categoryProducts = await productCLTN.find({
      category: currentCategory._id,
      listed: true,
    });
    res.render("index/productListing", {
      listing: categoryProducts,
      documentTitle: `${currentCategory.name} | TIMELESS`,
      listingName: currentCategory.name,
    });
  }
};
