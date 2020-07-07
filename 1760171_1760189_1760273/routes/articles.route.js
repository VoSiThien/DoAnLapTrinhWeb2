const express = require("express");

const categories = require("../models/categories.model");
const articles = require("../models/articles.model");
const tags = require("../models/tags.model");

const router = express.Router();

router.get("/post", (req, res) => {
  res.render("vwArticles/detail");
});

module.exports = router;
