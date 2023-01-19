const productCLTN = require("./../../models/admin/product");
const UserCLTN = require("../../models/user/details");
const wishlistCLTN = require("../../models/user/wishlist");
const productListing = require("../../controllers/index/productListing");
const ReviewCLTN = require("../../models/user/reviews");
const moment = require('moment')

exports.view = async (req, res) => {
  try {
    const currentUser = await UserCLTN.findById(req.session.userID);
    const productDetails = await productCLTN
      .findById(req.params.id)
      .populate("category");
    let productExistInWishlist = null;
    if (currentUser) {
      productExistInWishlist = await wishlistCLTN.findOne({
        customer: currentUser._id,
        products: req.params.id,
      });
    }
    let reviews = await ReviewCLTN.find({ product: productDetails._id })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "customer",
        select: "name photo",
      });
    const numberOfReviews = reviews.length;
    reviews = reviews.slice(0, 6);
    if (reviews == "") {
      reviews = null;
    }
    res.render("index/product", {
      documentTitle: productDetails.name,
      productDetails,
      session: req.session.userID,
      currentUser,
      productExistInWishlist,
      reviews,
      numberOfReviews,
      moment
    });
  } catch (error) {
    console.log("Error rendering product page: " + error);
  }
};

exports.listedCheck = async (req, res) => {
  const productListedCheck = await productCLTN.findById(req.body.id);
  if (productListedCheck.listed) {
    res.json({
      message: "listed",
    });
  } else {
    res.json({
      message: "unlisted",
    });
  }
};
