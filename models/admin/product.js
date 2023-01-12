const mongoose = require("mongoose");
const categoryCLTN = require("./category");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: categoryCLTN,
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
  thumbnail: {
    type: String,
    require,
  },
  frontImage: {
    type: String,
    require,
  },
  images: [String],
  stock: Number,
  listed: { type: Boolean, default: true },
});

const productCLTN = mongoose.model("Products", productSchema);
module.exports = productCLTN;
