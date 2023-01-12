const orderCLTN = require("../../models/user/orders");
const moment = require("moment");

exports.viewAll = async (req, res) => {
  const allOrders = await orderCLTN
    .find()
    .sort({ orderedOn: -1 })
    .populate("customer", "name email")
    .populate("couponUsed", "name")
    .populate("summary.product", "category name brand price")
    .populate("summary.product.category");
  res.render("admin/partials/orders", {
    allOrders,
    documentTitle: "Orders | TIMELESS",
    moment,
  });
};

exports.deliver = async (req, res) => {
  await orderCLTN.findByIdAndUpdate(req.body.orderID, {
    $set: {
      delivered: true,
      deliveredOn: Date.now(),
    },
  });
  res.json({
    data: { delivered: 1 },
  });
};

exports.details = async (req, res) => {
  const currentOrder = await orderCLTN
    .findById(req.params.id)
    .populate("summary.product")
    .populate("couponUsed")
  res.render("admin/partials/orderDetails", {
    currentOrder,
    moment,
    documentTitle: "Order Details | TIMELESS",
  });
};
