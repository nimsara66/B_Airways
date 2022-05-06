const adminAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.user_type==='admin') next()
    else {
        req.session.msg = "Login Required"
        res.redirect('/admin/login');
    }
}

module.exports = adminAuth