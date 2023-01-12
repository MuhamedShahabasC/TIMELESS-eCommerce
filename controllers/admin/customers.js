const { findById, findByIdAndUpdate } = require("../../models/admin/details");
const UserCLTN = require("../../models/user/details");

exports.viewAll = async (req, res) => {
  try {
    const allCustomers = await UserCLTN.find().sort({ name: -1 });
    res.render("admin/partials/customers", {
      allCustomers,
      documentTitle: "Customer Management | TIMELESS",
    });
  } catch (error) {
    console.log("Error listing all users: " + error);
  }
};

exports.changeAccess = async (req, res) => {
  try {
    let currentAccess = req.body.currentAccess === "true";
    currentAccess = !currentAccess
    await UserCLTN.findByIdAndUpdate(req.body.userID, {
      access: currentAccess,
    });
    res.json({
      data: { newAccess: currentAccess },
    });
  } catch (error) {
    console.log("Error changing user access: " + error);
  }
};
