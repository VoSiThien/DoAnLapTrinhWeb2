const express = require("express");

const categories = require("../models/categories.model");
const articles = require("../models/articles.model");
const tags = require("../models/tags.model");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = +req.params.id;

  const [row, _tags] = await Promise.all([
    articles.loadSingle(id),
    tags.loadArticleTags(id)
  ]);

  if (row[0]) {
    const _relatedArticles = await articles.load5DependCategory(id, row[0]['ChuyenMucID']);

    res.render("vwArticles/detail", {
      _article: row[0],
      _tags,
      _relatedArticles
    });
  }
});

module.exports = router;
