const bcrypt = require("bcrypt");
const UserCLTN = require("../../models/user/details");

exports.signInPage = (req, res) => {
  try {
    if (req.session.userID) {
      res.redirect("/");
    } else {
      res.render("user/partials/signIn", {
        documentTitle: "User Sign In | TIMELESS",
        session: null,
      });
    }
  } catch (error) {
    console.log("Error rendering user signin page: " + error);
  }
};

exports.userVerification = async (req, res) => {
  try {
    const inputEmail = req.body.email.toLowerCase();
    const inputPassword = req.body.password;
    const userFind = await UserCLTN.findOne({ email: inputEmail });
    if (userFind) {
      const hashedCheck = await bcrypt.compare(
        inputPassword,
        userFind.password
      );
      if (userFind.access == true) {
        if (hashedCheck) {
          req.session.userID = userFind._id;
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
  } catch (error) {
    console.log("Error signing in user: " + error);
  }
};
