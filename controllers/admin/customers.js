const { findById, findByIdAndUpdate } = require("../../models/admin/details");
const UserCLTN = require("../../models/user/details");
const List = (req, res) => {
  try {
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    const customersList = UserCLTN.find({}, (err, customersList) => {
      res.render("admin/partials/customers", {
        details: customersList,
        documentTitle: "Customer Management | TIMELESS",
      });
    }).sort({ name: -1 });
  } catch (error) {
    console.log("Error listing all users: " + error);
  }
};

const changeAccess = async (req, res) => {
  try {
    let currentAccess = req.query.currentAccess;
    if (currentAccess == "true") {
      currentAccess = currentAccess ? false : true;
    } else if (currentAccess == "false") {
      currentAccess = currentAccess ? true : false;
    }
    currentAccess = Boolean(currentAccess);
    const customerID = req.query.id;
    await UserCLTN.findByIdAndUpdate(customerID, { access: currentAccess });
    res.redirect("/admin/customer_management");
  } catch (error) {
    console.log("Error changing user access: " + error);
  }
};

module.exports = {
  List,
  changeAccess,
};
