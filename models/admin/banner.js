const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    description: String,
    url: String,
    videoURL: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BannerCLTN = mongoose.model("Banner", bannerSchema);
module.exports = BannerCLTN;
