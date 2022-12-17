const UserCLTN = require("../../models/user/details");

const signInPage = (req, res) => {
  res.render("user/partials/signIn", {
    documentTitle: "User Sign In",
  });
};

const bcrypt = require("bcrypt");
const userVerification = async (req, res) => {
  inputEmail = req.body.email;
  inputPassword = req.body.password;
  const userFind = await UserCLTN.findOne({ email: inputEmail });
  if (userFind) {
    const hashedCheck = await bcrypt.compare(inputPassword, userFind.password);
    if (hashedCheck) {
      req.session.user = req.body.email;
      console.log("User session created.");
      res.redirect("/");
    } else {
      res.render("user/partials/signIn", {
        documentTitle: "User Sign In",
        errorMessage: "Incorrect Password",
      });
    }
  } else {
    res.render("user/partials/signIn", {
      documentTitle: "User Sign In",
      errorMessage: "User not found",
    });
  }
};

module.exports = {
  signInPage,
  userVerification,
};
