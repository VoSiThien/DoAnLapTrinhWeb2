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
    const articleID = +req.params.id;

    const [timeOut, isPremium] = await Promise.all([
      accounts.readerPremium(
        req.session.isAuthenticated ? req.session.authUser["id"] : -1
      ),
      articles.articlePremium(articleID),
    ]);

    if (+isPremium[0]["IsPremium"] === 0) {
      // this article is not premium
      await articles.updateViewUp(articleID);
      return next();
    } else if (
      +isPremium[0]["IsPremium"] === 1 &&
      req.session.isAuthenticated
    ) {
      // this article is premium
      if (timeOut[0]["ThoiHan"] !== null) {
        const _timeOut = moment(new Date(timeOut[0]["ThoiHan"]));
        const now = moment();

        if (_timeOut >= now) {
          // can access
          await articles.updateViewUp(articleID);
          return next();
        }

        return res.redirect("/");
      } else {
        return res.redirect("/"); // can not access since ThoiHan is expired
      }
    }

    return res.redirect("/"); // not log in
  },
  formatDateTime: function (value) {
    const sqlDate = new Date(value);

    return moment(sqlDate).format("DD/MM/yyyy hh:mm:ss");
  },
  // new Array(end - start).fill().map((d, i) => i + start);
  rangeOfPagination: function (quantity, current) {
    if (quantity <= 5) {
      return new Array(5)
        .fill()
        .map((d, i) => Object({ value: i + 1 <= quantity ? i + 1 : -1 }));
    }
    let start = current - 3;
    let end = current + 1;

    if (start < 0) {
      start = 0;
      end = 4;
    } else if (end >= quantity) {
      end = quantity - 1;
      start = end - 4;
    }
    return new Array(5).fill().map((d, i) => Object({ value: i + start + 1 }));
  }
};
