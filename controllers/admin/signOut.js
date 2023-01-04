const signOut = (req, res) => {
  try {
    res.redirect("/admin");
  } catch (error) {
    console.log("Error signing out admin: " + error);
  }
};

module.exports = {
  signOut,
};
