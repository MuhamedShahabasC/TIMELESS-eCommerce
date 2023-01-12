exports.signOut = (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log("Error signing out user: " + error);
  }
};

