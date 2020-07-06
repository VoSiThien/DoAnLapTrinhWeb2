const express = require("express");

const categories = require("../models/categories.model");
const articles = require("../models/articles.model");
const tags = require("../models/tags.model");

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

  const [_10EachCategories, _20tags, _5Categories] = await Promise.all([
    articles.load10EachCategories(
      `(${[...res.locals.exceptArticles].join(",")})`
    ),
    tags.load20Tags(),
    categories.load5CategoriesDesc()
  ]);

  res.render("home", {
    _4OutstandingArticles,
    _10MostViewArticles,
    _10LatestArticles,
    _10EachCategories,
    _20tags,
    _5Categories
  });
});

module.exports = router;
