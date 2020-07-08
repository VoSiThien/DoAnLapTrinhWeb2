const express = require("express");

const articles = require("../models/articles.model");

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

module.exports = router;
