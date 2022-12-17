const signOut = (req, res) => {
    res.redirect('/user/signIn');
}

module.exports = {
    signOut
}