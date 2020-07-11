const express = require("express");

const comments = require("../models/comments.model");
const articles = require("../models/articles.model");
const tags = require("../models/tags.model");
const mdlFunction = require("../middlewares/middle-functions.mdw");

const router = express.Router();

// new Array(end - start).fill().map((d, i) => i + start);
const rangeOfPagination = (quantity, current) => {
  if (quantity <= 5)
    return new Array(quantity).fill().map((d, i) => Object({ value: i + 1 }));

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
};

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
      _pagi: rangeOfPagination(Math.ceil(+quantity[0]['SoLuong']/5), 1),
    });
  }
});

router.get("", async (req, res) => {
  const [id, page] = [req.query.id, req.query.page];
  
  const _comments = await comments.load5CommentsOffset(id, (page - 1)*5);

  res.json(_comments);
});

module.exports = router;
