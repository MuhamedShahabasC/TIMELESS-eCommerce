const { default: mongoose } = require("mongoose");
const sharp = require("sharp");
const categoriesCLTN = require("../../models/admin/category");
const productCLTN = require("../../models/admin/product");

exports.page = async (req, res) => {
  try {
    const allCategories = await categoriesCLTN.find({});
    const allProducts = await productCLTN.find().populate("category");
    res.render("admin/partials/products", {
      documentTitle: "Product Management | TIMELESS",
      categories: allCategories,
      products: allProducts,
    });
  } catch (error) {
    console.log("Product Page rendering error: " + error);
  }
};

exports.addProduct = async (req, res) => {
  try {
    let frontImage = `${req.body.name}_frontImage_${Date.now()}.png`;
    sharp(req.files.frontImage[0].buffer)
      .toFormat("png")
      .png({ quality: 80 })
      .toFile(`public/img/products/${frontImage}`);
    req.body.frontImage = frontImage;
    let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
    sharp(req.files.thumbnail[0].buffer)
      .toFormat("png")
      .png({ quality: 80 })
      .toFile(`public/img/products/${thumbnail}`);
    req.body.thumbnail = thumbnail;
    const newImages = [];
    for (i = 0; i < 3; i++) {
      imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
      sharp(req.files.images[i].buffer)
        .toFormat("png")
        .png({ quality: 80 })
        .toFile(`public/img/products/${imageName}`);
      newImages.push(imageName);
    }
    req.body.images = newImages;
    req.body.category = mongoose.Types.ObjectId(req.body.category);
    const newProduct = new productCLTN(req.body);
    await newProduct.save();
    console.log("Product added successfully");
    res.redirect("/admin/product_management");
  } catch (error) {
    console.log("Product adding error: " + error);
  }
};

exports.editPage = async (req, res) => {
  try {
    const currentProduct = await productCLTN
      .findById(req.query.id)
      .populate("category");
    const categories = await categoriesCLTN.find({});
    res.render("admin/partials/editProducts", {
      documentTitle: "Edit Product | TIMELESS",
      product: currentProduct,
      categories: categories,
    });
  } catch (error) {
    console.log("Product editing GET error: " + error);
  }
};

exports.edit = async (req, res) => {
  try {
    if (JSON.stringify(req.files) !== "{}") {
      console.log("req.files", req.files);
      if (req.files.frontImage) {
        let frontImage = `${req.body.name}_frontImage_${Date.now()}.png`;
        sharp(req.files.frontImage[0].buffer)
          .toFormat("png")
          .png({ quality: 80 })
          .toFile(`public/img/products/${frontImage}`);
        req.body.frontImage = frontImage;
      }
      console.log(req.body);
      if (req.files.thumbnail) {
        let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
        sharp(req.files.thumbnail[0].buffer)
          .toFormat("png")
          .png({ quality: 80 })
          .toFile(`public/img/products/${thumbnail}`);
        req.body.thumbnail = thumbnail;
      }
      if (req.files.images) {
        const newImages = [];
        for (i = 0; i < 3; i++) {
          imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
          sharp(req.files.images[i].buffer)
            .toFormat("png")
            .png({ quality: 80 })
            .toFile(`public/img/products/${imageName}`);
          newImages.push(imageName);
        }
        req.body.images = newImages;
      }
    }
    req.body.category = mongoose.Types.ObjectId(req.body.category);
    await productCLTN.findByIdAndUpdate(req.query.id, req.body);
    console.log("Product edited successfully");
    res.redirect("/admin/product_management");
  } catch (error) {
    console.log("Product editing POST error: " + error);
  }
};

exports.changeListing = async (req, res) => {
  try {
    const currentProduct = await productCLTN.findById(req.query.id);
    let currentListing = currentProduct.listed;
    if (currentListing == true) {
      currentListing = false;
    } else {
      currentListing = true;
    }
    currentListing = Boolean(currentListing);
    await productCLTN.findByIdAndUpdate(currentProduct._id, {
      listed: currentListing,
    });
    res.redirect("/admin/product_management");
  } catch (error) {
    console.log("Product listing changing error: " + error);
  }
};
