const { default: mongoose } = require("mongoose");
const productCLTN = require("../../models/admin/product");
const wishlistCLTN = require("../../models/user/wishlist");

exports.viewAll = async (req, res) => {
  try {
    const userWishlist = await wishlistCLTN
      .findOne({ customer: req.session.userID })
      .populate("products");
    res.render("user/profile/partials/wishlist", {
      userWishlist,
      documentTitle: "Your Wishlist | TIMELESS",
    });
  } catch (error) {
    console.log("Error rendering wishlist page: " + error);
  }
};

exports.addNew = async (req, res) => {
  const userWishlist = await wishlistCLTN.findOne({
    customer: req.session.userID,
  });
  const product = await productCLTN.findById(req.params.id);
  const productExist = await wishlistCLTN.findOne({
    _id: userWishlist._id,
    products: req.params.id,
  });
  if (productExist) {
    res.redirect("/products/" + product._id);
  } else {
    await wishlistCLTN.findByIdAndUpdate(userWishlist._id, {
      $push: {
        products: [req.params.id],
      },
    });
    res.redirect("/products/" + product._id);
  }
};

exports.addToCart = async (req, res) => {
  const userWishlist = await wishlistCLTN.findOne({
    customer: req.session.userID,
  });
  const product = await productCLTN.findById(req.params.id);
  await wishlistCLTN.findByIdAndUpdate(userWishlist._id, {
    $pull: {
      products: req.params.id,
    },
  });
  res.redirect("/users/cart/addToCart/" + req.params.id);
};

exports.remove = async (req, res) => {
  const userWishlist = await wishlistCLTN.findOne({
    customer: req.session.userID,
  });
  const product = await productCLTN.findById(req.params.id);
  await wishlistCLTN.updateOne(
    {
      _id: userWishlist._id,
    },
    {
      $pull: {
        products: req.params.id,
      },
    }
  );
  res.redirect("/products/" + product._id);
};
