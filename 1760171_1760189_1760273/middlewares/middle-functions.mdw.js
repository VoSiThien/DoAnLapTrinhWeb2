const articles = require("../models/articles.model");
const accounts = require("../models/accounts.model");
const moment = require("moment");

module.exports = {
  isLoggedIn: function (req, res, next) {
    if (!req.session.isAuthenticated) {
      return res.redirect("/");
    }

    next();
  },

  canAccessArticles: async function (req, res, next) {
    const articleID = req.params.id;

    const [timeOut, isPremium] = await Promise.all([
      accounts.readerPremium(
        req.session.isAuthenticated ? req.session.authUser["id"] : -1
      ),
      articles.articlePremium(articleID),
    ]);
  
    if (+isPremium[0]["IsPremium"] === 0) {
      // this article is not premium
      return next();
    } else if (+isPremium[0]["IsPremium"] === 1 && req.session.isAuthenticated) {
      // this article is premium
      if (timeOut[0]["ThoiHan"] !== null) {
        const _timeOut = moment(new Date(timeOut[0]["ThoiHan"]));
        const now = moment();
  
        if (_timeOut >= now) return next(); // can access
  
        return res.redirect('/');
      } else {
        return res.redirect('/'); // can not access since ThoiHan is expired
      }
    }
  
    return res.redirect('/'); // not log in
  }
};
