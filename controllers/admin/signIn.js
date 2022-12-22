const signInPage = (req, res) => {
  res.render("admin/partials/signIn", {
    documentTitle: "Admin Sign In",
  });
};

const adminCLTN = require("../../models/admin/details");
const bcrypt = require("bcrypt");
const adminVerification = async (req, res) => {
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;
  const adminFind = await adminCLTN.findOne({ email: inputEmail });
  if (adminFind) {
    const hashedCheck = await bcrypt.compare(inputPassword, adminFind.password);
    if (hashedCheck) {
      req.session.admin = req.body.email;
      console.log("Admin session created.");
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/partials/signIn", {
        documentTitle: "Admin Sign In | TIMELESS",
        errorMessage: "Incorrect Password",
      });
    }
  } else {
    res.render("admin/partials/signIn", {
      documentTitle: "Admin Sign In | TIMELESS",
      errorMessage: "Admin not found",
    });
  }
};

module.exports = {
  adminVerification,
  signInPage,
};
