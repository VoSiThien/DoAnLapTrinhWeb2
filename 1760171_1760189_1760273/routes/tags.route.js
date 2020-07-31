const express = require("express");

const articles = require("../models/articles.model");

const router = express.Router();

router.get("/:tagName", async (req, res) => {
  const tagName = decodeURI(req.params.tagName);

  const [_articles, _rightArticles] = await Promise.all([
    articles.getArticleDependTag(tagName, 0),
    articles.load7RightArticlesColumnDependTag(tagName),
  ]);

  res.render("vwTags/list", {
    _articles,
    _rightArticles,
    _offset: 0,
    _tagName: tagName,
  });
});

module.exports = router;
