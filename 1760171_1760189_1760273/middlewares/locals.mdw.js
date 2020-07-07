const LRU = require("lru-cache");
const catModel = require("../models/categories.model");

const GLB_CATEGORIES = "globalCategories";

const cache = new LRU({
  max: 500,
  maxAge: 1000 * 60 * 60, // refresh after 1 hour
});

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const data = cache.get(GLB_CATEGORIES);
    let cats = undefined;

    if (!data) {
      const rows = await catModel.loadAll();
      cats = rows;
      cache.set(GLB_CATEGORIES, rows); // put `rows` back into `cache`

      // console.log(`-- Fetch ${GLB_CATEGORIES}`);
    } else {
      cats = data;

      // console.log(`++ Cache hit for ${GLB_CATEGORIES}`);
    }

    // format `res.locals.lcCats`
    res.locals.lcCats = []

    cats.forEach((cat) => {
      if (cat["ChuyenMucCon"] === null) {
        res.locals.lcCats.push([cat]);
      } else {
        for (let i = 0; i < cats.length; ++i) {
          if (res.locals.lcCats[i][0]["id"] === cat["ChuyenMucCon"]) {
            res.locals.lcCats[i].push(cat);
            break;
          }
        }
      }
    });

    next();
  });
};
