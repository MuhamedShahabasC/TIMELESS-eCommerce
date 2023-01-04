const orderCLTN = require("../../models/user/orders");

exports.viewAll = async (req, res) => {
  const allOrders = await orderCLTN
    .find({
      customer: req.session.userID,
    })
    .populate("customer");
  res.render("user/profile/partials/orders", {
    documentTitle: "My Orders | TIMELESS",
    allOrders,
  });
};
