const orderCLTN = require("../../models/user/orders");
const moment = require("moment");

exports.viewAll = async (req, res) => {
  try {
    const allOrders = await orderCLTN
      .find()
      .populate("customer", "name email")
      .populate("couponUsed", "name")
      .populate("summary.product", "category name brand price")
      .populate("summary.product.category")
      .sort({ _id: -1 });
    res.render("admin/partials/orders", {
      allOrders,
      documentTitle: "Orders | TIMELESS",
      moment,
    });
  } catch (error) {
    console.log("Error rendering all orders: " + error);
  }
};

exports.deliver = async (req, res) => {
  try {
    await orderCLTN.findByIdAndUpdate(req.body.orderID, {
      $set: {
        delivered: true,
        deliveredOn: Date.now(),
      },
    });
    res.json({
      data: { delivered: 1 },
    });
  } catch (error) {
    console.log("Error delivering product: " + error);
  }
};

exports.details = async (req, res) => {
  try {
    const currentOrder = await orderCLTN
      .findById(req.params.id)
      .populate("summary.product")
      .populate("couponUsed");
    res.render("admin/partials/orderDetails", {
      currentOrder,
      moment,
      documentTitle: "Order Details | TIMELESS",
    });
  } catch (error) {
    console.log("Error rendering single order details: " + error);
  }
};
