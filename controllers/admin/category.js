const { findById, findByIdAndUpdate } = require("../../models/admin/category");
const categoryCLTN = require("../../models/admin/category");

const list = async (req, res) => {
  const categories = await categoryCLTN.find({});
  res.render("admin/partials/categories", {
    documentTitle: "Category Management | TIMELESS",
    details: categories,
  });
};

const addCategory = async (req, res) => {
  const inputCategory = req.body.category;
  const categories = await categoryCLTN.find({});
  const categoryCheck = await categoryCLTN.findOne({ name: inputCategory });
  if (categoryCheck) {
    res.render("admin/partials/categories", {
      documentTitle: "Category Management | TIMELESS",
      details: categories,
      errorMessage: "Category Already existing.",
    });
  } else {
    const newCategory = new categoryCLTN({
      name: inputCategory,
    });
    await newCategory.save();
    res.redirect("/admin/categories");
  }
};

let currentCategory;
const editPage = async (req, res) => {
  const categoryId = req.query.id;
  currentCategory = await categoryCLTN.findById(categoryId);
  res.render("admin/partials/editCategory", {
    documentTitle: "Edit Category | TIMELESS",
    category: currentCategory,
  });
};

const editCategory = async (req, res) => {
  const duplicationCheck = await categoryCLTN.findOne({ name: req.body.name });
    if (duplicationCheck==null) {
    await categoryCLTN.findByIdAndUpdate(
      { _id: currentCategory._id },
      { $set: { name: req.body.name } }
    );
    res.redirect("/admin/categories");
  } else{
    res.render("admin/partials/editCategory", {
      documentTitle: "Edit Category | TIMELESS",
      errorMessage: "Duplication of categories not allowed",
      category: null,
    });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.query.id;
  const deleteUser = await categoryCLTN.findByIdAndDelete(categoryId);
  res.redirect("/admin/categories");
};

module.exports = {
  addCategory,
  list,
  deleteCategory,
  editCategory,
  editPage,
};
