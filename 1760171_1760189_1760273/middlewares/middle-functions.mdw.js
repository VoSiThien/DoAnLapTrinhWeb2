module.exports = {
  isLoggedIn: function (req, res, next) {
    if (!req.session.isAuthenticated) {
      return res.redirect("/");
    }

    next();
  },
};
