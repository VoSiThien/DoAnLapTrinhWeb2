const LRU = require("lru-cache");
const catModel = require("../models/categories.model");
const tagModel = require("../models/tags.model");

const GLB_CATEGORIES = "globalCategories";
const GLB_FOOTER_TAGS = "globalFooterTags";
const GBL_FOOTER_CATEGORIES = "globalFooterCategories";

const cache = new LRU({
  max: 500,
  maxAge: 1000 * 60 * 60, // refresh after 1 hour
});

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const data = cache.get(GLB_CATEGORIES);
    let cats = undefined;
    let fTags = undefined;
    let fCats = undefined;

    if (!data) {
      const rows = await catModel.loadAll();

      const [_cats, _fTags, _fCats] = await Promise.all([
        catModel.loadAll(),
        tagModel.load20Tags(),
        catModel.load5CategoriesDesc()
      ]);

      cats = _cats;
      fTags = _fTags;
      fCats = _fCats;

      cache.set(GLB_CATEGORIES, _cats);
      cache.set(GLB_FOOTER_TAGS, _fTags);
      cache.set(GBL_FOOTER_CATEGORIES, _fCats);

      // console.log(`-- Fetch ${GLB_CATEGORIES}`);
    } else {
      cats = data;
      fTags = cache.get(GLB_FOOTER_TAGS);
      fCats = cache.get(GBL_FOOTER_CATEGORIES);

      // console.log(`++ Cache hit for ${GLB_CATEGORIES}`);
    }

    res.locals.lcFTags = fTags;
    res.locals.lcFCats = fCats;
    res.locals.lcCats = []; // format `res.locals.lcCats`

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
