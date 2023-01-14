const couponCLTN = require("./../../models/admin/coupons");
const moment = require("moment");

exports.page = async (req, res) => {
  try {
    const coupons = await couponCLTN.find();
    res.render("admin/partials/coupons", {
      documentTitle: "Coupon Management",
      coupons,
      moment,
    });
  } catch (error) {
    console.log("Error rendering coupon page: " + error);
  }
};

exports.addNew = async (req, res) => {
  try {
    const newCoupon = new couponCLTN({
      name: req.body.name,
      code: req.body.code,
      discount: req.body.discount,
      startingDate: req.body.startingDate,
      expiryDate: req.body.expiryDate,
    });
    await newCoupon.save();
    res.redirect("/admin/coupon_management");
  } catch (error) {
    console.log("Error adding new coupon: " + error);
  }
};

exports.changeActivity = async (req, res) => {
  try {
    const currentCoupon = await couponCLTN.findById(req.query.id);
    let currentActivity = currentCoupon.active;
    if (currentActivity == true) {
      currentActivity = false;
    } else {
      currentActivity = true;
    }
    currentActivity = Boolean(currentActivity);
    await couponCLTN.findByIdAndUpdate(currentCoupon._id, {
      $set: { active: currentActivity },
    });
    res.redirect("/admin/coupon_management");
  } catch (error) {
    console.log("Error changing coupon activity: " + error);
  }
};
