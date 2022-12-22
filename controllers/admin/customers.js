const { findById, findByIdAndUpdate } = require("../../models/admin/details");
const UserCLTN = require("../../models/user/details");
const List = (req, res) => {
  let search = "";
  if (req.query.search) {
    search = req.query.search;
  }
  const customersList = UserCLTN.find(
    {
      $or: [
        { name: { $regex: "^" + search + ".*", $options: "i" } },
        { email: { $regex: "^" + search + ".*", $options: "i" } },
      ],
    },
    (err, customersList) => {
      res.render("admin/partials/customers", {
        details: customersList,
        documentTitle: "Customer Management | TIMELESS",
      });
    }
  ).sort({ name: -1 });
};

const changeAccess = async (req, res) => {
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
};

module.exports = {
  List,
  changeAccess,
};
