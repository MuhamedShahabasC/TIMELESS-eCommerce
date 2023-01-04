const sessionCheck = (req, res, next) => {
    if (req.session.userID) {
        next()
    } else {
        res.redirect('/users/signIn')
    }
}

module.exports = sessionCheck;