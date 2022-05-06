const staffAuth = (req, res, next) => {
    if (req.isAuthenticated() && (
        req.user.user_type==='admin' || req.user.user_type==='staff'
        )) next()
    else {
        req.session.msg = "Login Required"
        res.redirect('/staff/login');
    }
}

module.exports = staffAuth