module.exports = {
  isLoggedIn: function (req, res, next) {
    if (res.session.isAuthenticated) {
      return res.redirect('/');
    }
    
    next();
  }
}