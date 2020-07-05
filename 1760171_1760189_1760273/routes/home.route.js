const express = require("express");

const articles = require("../models/articles.model");

const router = express.Router();

router.get("", async (req, res) => {
  const _4OutstandingArticles = await articles.load4OutstandingPosts();

  res.render("home", { _4OutstandingArticles });
});

module.exports = router;
