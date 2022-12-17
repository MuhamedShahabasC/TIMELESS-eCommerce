const signOut = (req, res) => {
    res.redirect('/admin');
}

module.exports = {
    signOut
}