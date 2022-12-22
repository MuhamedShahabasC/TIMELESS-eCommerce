const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require,
  },
  category: {
    type: String,
    require,
  },
  brand: {
    type: String,
    require,
  },
  price: {
    type: Number,
    require,
  },
  color: {
    type: String,
    require,
  },
  referenceNumber: {
    type: Number,
    require,
  },
  modelCase: {
    type: String,
    require,
  },
  waterResistance: {
    type: String,
    require,
  },
  movement: {
    type: String,
    require,
  },
  powerReserve: {
    type: String,
    require,
  },
  bracelet: {
    type: String,
    require,
  },
  heroImage: {
    type: String,
    require,
  },
  image1: {
    type: String,
    require,
  },
  image2: {
    type: String,
    require,
  },
  image3: {
    type: String,
    require,
  },
  stock: Number,
  listed: { type: Boolean, default: true },
});

const productCLTN = mongoose.model("Products", productSchema);
module.exports = productCLTN;
