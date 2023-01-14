const categoryCLTN = require("../../models/admin/category");

exports.list = async (req, res) => {
  try {
    const categories = await categoryCLTN.find({});
    res.render("admin/partials/categories", {
      documentTitle: "Category Management | TIMELESS",
      details: categories,
    });
  } catch (error) {
    console.log("Error rendering all catergories: " + error);
  }
};

exports.addCategory = async (req, res) => {
  try {
    let inputCategory = req.body.category;
    inputCategory = inputCategory.toLowerCase();
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
  } catch (error) {
    console.log("Error adding new category: " + error);
  }
};

exports.editPage = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const currentCategory = await categoryCLTN.findById(categoryId);
    res.render("admin/partials/editCategory", {
      documentTitle: "Edit Category | TIMELESS",
      category: currentCategory,
    });
    req.session.currentCategory = currentCategory;
  } catch (error) {
    console.log("Error GET category Page: " + error);
  }
};

exports.editCategory = async (req, res) => {
  try {
    const currentCategory = req.session.currentCategory;
    let newCategory = req.body.name;
    newCategory = newCategory.toUpperCase();
    const duplicationCheck = await categoryCLTN.findOne({
      name: newCategory,
    });
    if (duplicationCheck == null) {
      await categoryCLTN.findByIdAndUpdate(
        { _id: currentCategory._id },
        { $set: { name: newCategory } }
      );
      res.redirect("/admin/categories");
    } else {
      res.render("admin/partials/editCategory", {
        documentTitle: "Edit Category | TIMELESS",
        errorMessage: "Duplication of categories not allowed",
        category: null,
      });
    }
  } catch (error) {
    console.log("Error POST edit category Page: " + error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const deleteUser = await categoryCLTN.findByIdAndDelete(categoryId);
    res.redirect("/admin/categories");
  } catch (error) {
    console.log("Error deleting category: " + error);
  }
};
