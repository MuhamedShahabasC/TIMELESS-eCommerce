const orderCLTN = require("../../models/user/orders");
const moment = require("moment");
const UserCLTN = require("../../models/user/details");
const productCLTN = require("../../models/admin/product");

exports.view = async (req, res) => {
  try {
    const recentOrders = await orderCLTN
      .find()
      .limit(20)
      .sort({ _id: -1 })
      .populate({ path: "customer", select: "email" });
    const orderCount = recentOrders.length;
    const customerCount = await UserCLTN.countDocuments();
    const productCount = await productCLTN.countDocuments();
    let totalRevenue;
    if (customerCount) {
      totalRevenue = await orderCLTN.aggregate([
        {
          $group: {
            _id: 0,
            totalRevenue: { $sum: "$finalPrice" },
          },
        },
      ]);
      if (totalRevenue) {
        totalRevenue = totalRevenue[0].totalRevenue;
      }
    } else {
      totalRevenue = 0;
    }
    res.render("admin/partials/dashboard", {
      recentOrders,
      moment,
      orderCount,
      customerCount,
      productCount,
      totalRevenue,
    });
  } catch (error) {
    console.log("Error rendering dashboard: " + error);
  }
};

exports.chartData = async (req, res) => {
  try {
    let currentYear = new Date();
    currentYear = currentYear.getFullYear();
    const orderData = await orderCLTN.aggregate([
      {
        $project: {
          _id: 0,
          totalProducts: "$totalQuantity",
          billAmount: "$finalPrice",
          month: {
            $month: "$orderedOn",
          },
          year: {
            $year: "$orderedOn",
          },
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalProducts: { $sum: "$totalProducts" },
          totalOrders: { $sum: 1 },
          revenue: {
            $sum: "$billAmount",
          },
          avgBillPerOrder: {
            $avg: "$billAmount",
          },
        },
      },
      {
        $match: {
          "_id.year": currentYear,
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);
    res.json({
      data: orderData,
    });
  } catch (error) {
    console.log("Error creating chart data: " + error);
  }
};
