const LRU = require("lru-cache");
const catModel = require("../models/categories.model");

const GLB_CATEGORIES = 'globalCategories';

const cache = new LRU({
  max: 500,
  maxAge: 1000 * 60 * 60, // refresh after 1 hour
});

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const data = cache.get(GLB_CATEGORIES);

    if (!data) {
      const rows = await catModel.loadAll();
      res.locals.cat = rows;
      cache.set(GLB_CATEGORIES, rows); // put `rows` back into `cache`

      console.log(`-- Fetch ${GLB_CATEGORIES}`);
    } else {
      res.locals.cat = data;

      console.log(`++ Cache hit for ${GLB_CATEGORIES}`);
    }

    next();
  });
};
