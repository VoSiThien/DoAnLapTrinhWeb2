const express = require("express");

const categories = require("../models/categories.model");
const articles = require("../models/articles.model");

const router = express.Router();


router.get('/:id', async (req, res) => {
  const id = +req.params.id;

  const categoryName = (await categories.loadCategoryTitle(id))[0];

  if (categoryName['ChuyenMucCon'] === null) {
    const [_articles] = await Promise.all([
      articles.load7DependCategoryOffset(id, 0)
    ]);

    res.render('vwCategories/list', {
      _categoryName: categoryName,
      _articles,
      _offset: 0
    });
  }
});

module.exports = router;
