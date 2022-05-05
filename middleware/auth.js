function isAuth(req, res, next) {
    if (req.isAuthenticated()) next()
    else {
        req.session.msg = "Login Required"
        res.redirect('/auth/login');
    }
}

module.exports = isAuth