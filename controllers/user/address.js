const { findOne, find } = require("../../models/user/details");
const UserCLTN = require("../../models/user/details");

const viewAll = async (req, res) => {
  try {
    const userID = req.session.userID;
    const currentUser = await UserCLTN.findById(userID);
    const allAddresses = currentUser.addresses;
    res.render("user/profile/partials/address", {
      documentTitle: "User Addresses",
      allAddresses,
    });
  } catch (error) {
    console.log("Error listing all addresses: " + error);
  }
};

const addNew = async (req, res) => {
  try {
    const userID = req.session.userID;
    await UserCLTN.updateMany(
      { _id: userID, "addresses.primary": true },
      { $set: { "addresses.$.primary": false } }
    );
    await UserCLTN.updateOne(
      { _id: userID },
      {
        $push: {
          addresses: {
            building: req.body.building,
            address: req.body.address,
            pincode: req.body.pincode,
            country: req.body.country,
            contactNumber: req.body.contactNumber,
            primary: true,
          },
        },
      }
    );
    res.redirect("/users/addresses");
  } catch (error) {
    console.log("Error adding new address: " + error);
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userID = req.session.userID;
    const addressID = req.query.addressID;
    await UserCLTN.updateOne(
      { _id: userID },
      { $pull: { addresses: { _id: addressID } } }
    );
    res.redirect("/users/addresses");
  } catch (error) {
    console.log("Error deleting addresses: " + error);
  }
};

const defaultToggler = async (req, res) => {
  try {
    const userID = req.session.userID;
    const currentAddressID = req.query.addressID;
    await UserCLTN.updateMany(
      { _id: userID, "addresses.primary": true },
      { $set: { "addresses.$.primary": false } }
    );
    await UserCLTN.updateOne(
      { _id: userID, "addresses._id": currentAddressID },
      { $set: { "addresses.$.primary": true } }
    );
    res.redirect("/users/addresses");
  } catch (error) {
    console.log("Error changing default address: " + error);
  }
};

module.exports = {
  viewAll,
  addNew,
  deleteAddress,
  defaultToggler,
};
