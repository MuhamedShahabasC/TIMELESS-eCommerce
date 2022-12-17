const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

const adminCLTN = mongoose.model("AdminDetails", adminSchema);

module.exports = adminCLTN;


// ------------- Create new admin -----------

// const bcrypt = require("bcrypt");
// const createAdmin = async () => {
//   const saltRounds = 10;
//   const password = process.env.ADMIN_PASSWORD;
//   const email = process.env.ADMIN_EMAIL;
//   const name = process.env.ADMIN_NAME;
//   const hashedPassword = await bcrypt.hash(password, saltRounds);
//   const newAdminDetails = new adminCLTN({
//     name: name,
//     email: email,
//     password: hashedPassword,
//   });
//   await newAdminDetails.save();
// };
// --------- add module.exports --------------
// -----  Add below to app.js ---------
// const adminCLTN = require('./models/admin/details')
// adminCLTN.createAdmin();
