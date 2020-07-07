const express = require("express");

const categories = require("../models/categories.model");
const articles = require("../models/articles.model");
const tags = require("../models/tags.model");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = +req.params.id;
  const row = (await articles.loadSingle(id))[0];

  if (row) {
    res.render("vwArticles/detail", {
      _article: row
    });
  }
});

module.exports = router;
