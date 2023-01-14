exports.signOut = (req, res) => {
  try {
    res.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log("Error signing out admin: " + error);
  }
};
