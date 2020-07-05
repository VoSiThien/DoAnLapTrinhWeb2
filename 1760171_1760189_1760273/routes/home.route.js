const express = require("express");

const articles = require("../models/articles.model");

const router = express.Router();

router.get("", async (req, res) => {
  res.locals.exceptArticles = new Set();

  const _4OutstandingArticles = await articles.load4OutstandingPosts();
  
  _4OutstandingArticles.forEach(record => res.locals.exceptArticles.add(record['id']));

  const _10MostViewArticles = await articles.load10MostViewArticles(`(${[...res.locals.exceptArticles].join(',')})`);

  

  res.render("home", { _4OutstandingArticles, _10MostViewArticles });
});

module.exports = router;
