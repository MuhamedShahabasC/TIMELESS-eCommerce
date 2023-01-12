const moment = require("moment/moment");
const orderCLTN = require("../../models/user/orders");

exports.viewAll = async (req, res) => {
  try {
    const allOrders = await orderCLTN
      .find({
        customer: req.session.userID,
      })
      .populate("customer")
      .populate("couponUsed");
    res.render("user/profile/partials/orders", {
      documentTitle: "My Orders | TIMELESS",
      allOrders,
      moment
    });
  } catch (error) {
    console.log("Error rendering orders: " + error);
  }
};

exports.details = async (req, res) => {
  const currentOrder = await orderCLTN
    .findById(req.params.id)
    .populate("summary.product")
    .populate("couponUsed").sort('');
  if (currentOrder) {
    res.render("user/profile/partials/orderDetails", {
      documentTitle: "Order Details | TIMELESS",
      currentOrder,
      moment
    });
  } else {
    res.redirect('/pageNotFound')
  }
};
