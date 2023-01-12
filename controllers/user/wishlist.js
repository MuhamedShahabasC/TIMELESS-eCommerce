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

exports.addOrRemove = async (req, res) => {
  try {
    const userWishlist = await wishlistCLTN.findOne({
      customer: req.session.userID,
    });
    if (userWishlist) {
      const product = await productCLTN.findById(req.body.id);
      const productExist = await wishlistCLTN.findOne({
        _id: userWishlist._id,
        products: req.body.id,
      });
      if (!productExist) {
        await wishlistCLTN.findByIdAndUpdate(userWishlist._id, {
          $push: {
            products: [req.body.id],
          },
        });
        res.json({
          data: {
            message: 1,
          },
        });
      } else {
        await wishlistCLTN.updateOne(
          {
            _id: userWishlist._id,
          },
          {
            $pull: {
              products: req.body.id,
            },
          }
        );
        res.json({
          data: {
            message: 0,
          },
        });
      }
    } else {
      res.json({
        data: {
          message: null,
        },
      });
    }
  } catch (error) {
    console.log("Error adding or removing from wishlist: " + error);
  }
};

exports.remove = async (req, res) => {
  const userWishlist = await wishlistCLTN.findOne({
    customer: req.session.userID,
  });
  await wishlistCLTN.updateOne(
    {
      _id: userWishlist._id,
    },
    {
      $pull: {
        products: req.body.productID,
      },
    }
  );
  res.json({
    data: {
      deleted: 1,
    },
  });
};
