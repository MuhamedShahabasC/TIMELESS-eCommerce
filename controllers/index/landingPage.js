const productCLTN = require("../../models/admin/product");
const UserCLTN = require("../../models/user/details");
const BannerCLTN = require("../../models/admin/banner");

exports.viewAll = async (req, res) => {
  try {
    let currentUser = null;
    if (req.session.userID) {
      currentUser = await UserCLTN.findById(req.session.userID);
    }
    const allProducts = await productCLTN.find().sort({ _id: -1 });
    let men = [];
    let women = [];
    allProducts.forEach((product) => {
      if (product.category == "63a0523eceb514042442b2f4") {
        women.push(product);
      } else if (product.category == "63a051ff7b36d782859a1e3e") {
        men.push(product);
      }
    });
    women = women.slice(0, 3);
    men = men.slice(0, 3);

    const banners = await BannerCLTN.find({ active: true }).limit(3);
    const newReleases = allProducts.slice(0, 3);
    res.render("index/landingPage", {
      session: req.session.userID,
      currentUser,
      newReleases,
      men,
      women,
      banners,
    });
  } catch (error) {
    console.log("Error rendering landing page: " + error);
  }
};
