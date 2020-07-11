const express = require("express");

const comments = require("../models/comments.model");
const articles = require("../models/articles.model");
const tags = require("../models/tags.model");
const mdlFunction = require("../middlewares/middle-functions.mdw");

const router = express.Router();

router.get("/:id", mdlFunction.canAccessArticles, async (req, res) => {
  const id = +req.params.id;

  const row = await articles.loadSingle(id);

  if (row[0]) {
    const [_relatedArticles, _tags, _comments, quantity] = await Promise.all([
      articles.load5DependCategory(id, row[0]["ChuyenMucID"]),
      tags.loadArticleTags(id),
      comments.load5CommentsOffset(id, 0),
      comments.getCommentsQuantity(id),
    ]);

    res.render("vwArticles/detail", {
      _article: row[0],
      _tags,
      _relatedArticles,
      _comments,
      _pagi: mdlFunction.rangeOfPagination(Math.ceil(+quantity[0]["SoLuong"] / 5), 1),
    });
  }
});

router.get("", async (req, res) => {
  const [id, page] = [req.query.id, req.query.page];

  const [_comments, quantity] = await Promise.all([
    comments.load5CommentsOffset(id, (page - 1) * 5),
    comments.getCommentsQuantity(id),
  ]);

  const _pagi = mdlFunction.rangeOfPagination(Math.ceil(+quantity[0]["SoLuong"] / 5), page);

  res.json({ _comments, _pagi });
});

module.exports = router;
