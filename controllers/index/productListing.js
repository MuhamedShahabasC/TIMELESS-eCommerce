const categoryCLTN = require("../../models/admin/category");
const productCLTN = require("../../models/admin/product");
const UserCLTN = require("../../models/user/details");

exports.ourCollection = async (req, res) => {
  try {
    let currentUser = null;
    if (req.session.userID) {
      currentUser = await UserCLTN.findById(req.session.userID);
    }
    let listing = req.session.listing;
    listingName = "Our Collection";
    if (!listing) {
      listing = await productCLTN.find({ listed: true });
    }
    res.render("index/productListing", {
      session: req.session.userID,
      currentUser,
      listing,
      documentTitle: "TIMELESS",
      listingName,
    });
  } catch (error) {
    console.log("Error rendering our collection page: " + error);
  }
};

exports.current = async (req, res) => {
  try {
    let listing = req.session.listing;
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
    req.session.listing = currentFilter;
    req.session.filtered = currentFilter;
    if (!currentFilter) {
      res.json({
        success: 0,
      });
    } else {
      res.json({
        success: 1,
      });
    }
  } catch (error) {
    console.log("Error filtering products: " + error);
  }
};

exports.search = async (req, res) => {
  try {
    let searchResult = [];
    if (req.session.filtered) {
      const regex = new RegExp(req.body.searchInput, "i");
      req.session.filtered.map((product) => {
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
    req.session.listing = searchResult;
    res.json({
      success: 1,
    });
  } catch (error) {
    console.log("Error searching in listing page: " + error);
  }
};

exports.categories = async (req, res) => {
  try {
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
  } catch (error) {
    console.log("Error categorizing in products page: " + error);
  }
};
