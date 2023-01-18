const moment = require("moment/moment");
const orderCLTN = require("../../models/user/orders");

exports.viewAll = async (req, res) => {
  try {
    const allOrders = await orderCLTN
      .find({
        customer: req.session.userID,
      })
      .sort({ _id: -1 })
      .populate("customer")
      .populate("couponUsed");
    res.render("user/profile/partials/orders", {
      documentTitle: "My Orders | TIMELESS",
      allOrders,
      moment,
    });
  } catch (error) {
    console.log("Error rendering orders: " + error);
  }
};

exports.details = async (req, res) => {
  try {
    const currentOrder = await orderCLTN
      .findById(req.params.id)
      .populate("summary.product")
      .populate("couponUsed")
      .sort("");
    if (currentOrder) {
      res.render("user/profile/partials/orderDetails", {
        documentTitle: "Order Details | TIMELESS",
        currentOrder,
        moment,
      });
    } else {
      res.redirect("/pageNotFound");
    }
  } catch (error) {
    console.log("Error showing order results: " + error);
  }
};

exports.cancel = async (req, res) => {
  await orderCLTN.findByIdAndUpdate(req.params.id, {
    $set: {
      status: 'Cancelled',
      deliveredOn: null
    }
  })
  res.json({
    success: 'cancelled'
  })
}