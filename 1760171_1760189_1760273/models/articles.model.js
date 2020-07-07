const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  load4OutstandingPosts: function () {
    return db.load(queries.load4OutstandingArticles());
  },

  load10MostViewArticles: function (exceptArticles) {
    return db.load(queries.load10MostViewArticles(exceptArticles));
  },

  load10LatestArticles: function (exceptArticles) {
    return db.load(queries.load10LatestArticles(exceptArticles));
  },

  load10EachCategories: function (exceptArticles) {
    return db.load(queries.load10EachCategories(exceptArticles));
  },

  loadSingle: function (id) {
    return db.load(queries.loadSingle(id));
  }
};
