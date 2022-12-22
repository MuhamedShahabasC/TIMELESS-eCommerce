const UserCLTN = require("../../models/user/details");

const signInPage = (req, res) => {
  res.render("user/partials/signIn", {
    documentTitle: "User Sign In | TIMELESS",
  });
};

const bcrypt = require("bcrypt");
const userVerification = async (req, res) => {
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;
  const userFind = await UserCLTN.findOne({ email: inputEmail });
  if (userFind) {
    const hashedCheck = await bcrypt.compare(inputPassword, userFind.password);
    if (userFind.access == true) {
      if (hashedCheck) {
        res.redirect("/");
      } else {
        res.render("user/partials/signIn", {
          documentTitle: "User Sign In | TIMELESS",
          errorMessage: "Incorrect Password",
        });
      }
    } else {
      res.render("user/partials/signIn", {
        documentTitle: "User Sign In | TIMELESS",
        errorMessage: "Unauthorized User",
      });
    }
  } else {
    res.render("user/partials/signIn", {
      documentTitle: "User Sign In | TIMELESS",
      errorMessage: "User not found",
    });
  }
};

module.exports = {
  signInPage,
  userVerification,
};
