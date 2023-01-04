const UserCLTN = require("../../models/user/details");

const signInPage = (req, res) => {
  try {
    if (req.session.userID) {
      res.redirect('/')
    } else {
      res.render("user/partials/signIn", {
        documentTitle: "User Sign In | TIMELESS",
        session: null
      });
    }
  } catch (error) {
    console.log("Error rendering user signin page: " + error);
  }
};

const bcrypt = require("bcrypt");
const userVerification = async (req, res) => {
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
          // res.redirect("/");
          res.redirect('/')
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

module.exports = {
  signInPage,
  userVerification,
};
