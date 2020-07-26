const LRU = require("lru-cache");
const catModel = require("../models/categories.model");
const tagModel = require("../models/tags.model");
const artModel = require("../models/articles.model");

const GLB_CATEGORIES = "globalCategories";
const GLB_FOOTER_TAGS = "globalFooterTags";
const GLB_FOOTER_CATEGORIES = "globalFooterCategories";
const GLB_HEADER_ARTICLES = "globalHeaderArticles";

const cache = new LRU({
  max: 500,
  maxAge: 600000, // refresh after 10 minutes
});

module.exports = function (app) {
  app.use(async (req, res, next) => {
    let cats = cache.get(GLB_CATEGORIES);
    let fTags = cache.get(GLB_FOOTER_TAGS);
    let fCats = cache.get(GLB_FOOTER_CATEGORIES);
    let hArts = cache.get(GLB_HEADER_ARTICLES);

    if (!cats || !fTags || !fCats || !hArts) {
      await artModel.updateEntireArticlesStatus();

      const [_cats, _fTags, _fCats, _hArts] = await Promise.all([
        catModel.loadAll(),
        tagModel.load20Tags(),
        catModel.load5CategoriesDesc(),
        artModel.load4RemainingArticle(),
      ]);

      cats = _cats;
      fTags = _fTags;
      fCats = _fCats;
      hArts = _hArts;

      // save to cache
      cache.set(GLB_CATEGORIES, _cats);
      cache.set(GLB_FOOTER_TAGS, _fTags);
      cache.set(GLB_FOOTER_CATEGORIES, _fCats);
      cache.set(GLB_HEADER_ARTICLES, _hArts);
    }

    res.locals.lcFTags = fTags;
    res.locals.lcHArts = hArts;
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

  app.use((req, res, next) => {
    if (req.session.isAuthenticated === null) {
      req.session.isAuthenticated = false;
    }

    res.locals.lcIsAuthenticated = req.session.isAuthenticated;
    res.locals.lcAuthUser = req.session.authUser;

    next();
  });
};
