const { findById } = require("../../models/user/details");
const UserCLTN = require("../../models/user/details");
const mongoose = require("mongoose");

const page = async (req, res) => {
  try {
    const userID = req.session.userID;

    const currentUser = await UserCLTN.findById(userID);
    const defaultAddress = await UserCLTN.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userID),
        },
      },
      {
        $unwind: "$addresses",
      },
      {
        $match: {
          "addresses.primary": true,
        },
      },
    ]);
    res.render("user/profile/partials/profile", {
      documentTitle: "User Profile",
      currentUser,
      defaultAddress,
    });
  } catch (error) {
    console.log("Error rendering user profile page: " + error);
  }
};

const update = async (req, res) => {
  try {
    const userID = req.session.userID;
    const newName = req.body.name;
    await UserCLTN.findByIdAndUpdate(userID, { name: newName });
    res.redirect("/users/profile");
  } catch (error) {
    console.log("Error updating user details: " + error);
  }
};

module.exports = {
  page,
  update,
};
