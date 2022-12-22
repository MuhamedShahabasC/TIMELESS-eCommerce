const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    require,
    unique: true,
  },
});

const categoryCLTN = mongoose.model("Category", categorySchema);
module.exports = categoryCLTN;