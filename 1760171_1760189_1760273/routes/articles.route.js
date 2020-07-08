const express = require("express");

const comments = require("../models/comments.model");
const articles = require("../models/articles.model");
const tags = require("../models/tags.model");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const page = +req.query.page || 1;
  if (page < 1) page = 1;

  const id = +req.params.id;

  const row = await articles.loadSingle(id);

  if (row[0]) {
    const [_relatedArticles, _tags, _comments] = await Promise.all([
      articles.load5DependCategory(id, row[0]["ChuyenMucID"]),
      tags.loadArticleTags(id),
      comments.load5CommentsOffset(id, 0),
    ]);

    res.render("vwArticles/detail", {
      _article: row[0],
      _tags,
      _relatedArticles,
      _comments,
    });
  }
});

router.get("", (req, res) => {
  res.json({"id": req.query.id, "page": req.query.page});
});

module.exports = router;
