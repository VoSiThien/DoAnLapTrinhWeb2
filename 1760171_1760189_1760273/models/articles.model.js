const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  updateEntireArticlesStatus: function () {
    return db.load(queries.updateEntireArticlesStatus());
  },

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

  load4RemainingArticle: function () {
    return db.load(queries.load4RemainingArticle());
  },

  loadSingle: function (id) {
    return db.load(queries.loadSingle(id));
  },

  load5DependCategory: function (id, catID) {
    return db.load(queries.load5DependCategory(id, catID));
  },

  load7DependCategoryOffset: function (id, offset) {
    return db.load(queries.load7DependCategoryOffset(id, offset));
  },

  load7DependCategoryOffsetChild: function (id, offset) {
    return db.load(queries.load7DependCategoryOffsetChild(id, offset));
  },

  load7RightArticlesColumnDependTag: function(tag) {
    return db.load(queries.load7RightArticlesColumnDependTag(tag));
  },

  loadRightArticlesColumn: function (id) {
    return db.load(queries.loadRightArticlesColumn(id));
  },

  loadRightArticlesColumnChild: function (id) {
    return db.load(queries.loadRightArticlesColumnChild(id));
  },

  getArticleDependTag: function (tag, offset) {
    return db.load(queries.getArticleDependTag(tag, offset));
  },

  fullTextSearch: function (keyword) {
    return db.load(queries.fullTextSearch(keyword));
  },

  fullTextSearchOffset: function (keyword, offset) {
    return db.load(queries.fullTextSearchOffset(keyword, offset));
  },

  articlePremium: function (id) {
    return db.load(queries.articlePremium(id));
  },

  updateViewUp: function(id) {
    return db.load(queries.updateViewUp(id));
  }
};
