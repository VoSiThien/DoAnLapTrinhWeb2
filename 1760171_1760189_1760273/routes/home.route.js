const express = require("express");

const articles = require("../models/articles.model");
const categories = require("../models/categories.model");

const router = express.Router();

router.get("", async (req, res) => {
  res.locals.exceptArticles = new Set();

  const _4OutstandingArticles = await articles.load4OutstandingPosts();

  _4OutstandingArticles.forEach((record) =>
    res.locals.exceptArticles.add(record["id"])
  );

  const _10MostViewArticles = await articles.load10MostViewArticles(
    `(${[...res.locals.exceptArticles].join(",")})`
  );

  _10MostViewArticles.forEach((record) =>
    res.locals.exceptArticles.add(record["id"])
  );

  const _10LatestArticles = await articles.load10LatestArticles(
    `(${[...res.locals.exceptArticles].join(",")})`
  );

  _10LatestArticles.forEach((record) =>
    res.locals.exceptArticles.add(record["id"])
  );

  const _10EachCategories = await articles.load10EachCategories(
    `(${[...res.locals.exceptArticles].join(",")})`
  );

  res.render("vwHome/home", {
    _4OutstandingArticles,
    _10MostViewArticles,
    _10LatestArticles,
    _10EachCategories
  });
});

router.get('/search', async (req, res) => {
  const key = decodeURI(req.query.key);

  const data = await articles.fullTextSearch(key);

  res.json(data);
});

router.get('/category-load-more', async (req, res) => {
  const id = +req.query.id;
  const offset = +req.query.offset;

  const categoryName = (await categories.loadCategoryTitle(id))[0];

  if (categoryName['ChuyenMucCon'] === null) {
    res.json(await articles.load7DependCategoryOffset(id, offset * 2));
  }

});

module.exports = router;
