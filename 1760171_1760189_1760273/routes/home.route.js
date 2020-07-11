const express = require("express");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const articles = require("../models/articles.model");
const categories = require("../models/categories.model");
const accounts = require("../models/accounts.model");
const comments = require("../models/comments.model");

const router = express.Router();

router.get("", async (req, res) => {
  res.locals.exceptArticles = new Set();

  const _4OutstandingArticles = await articles.load4OutstandingPosts();

  _4OutstandingArticles.forEach((record) =>
    res.locals.exceptArticles.add(record["id"])
  );

  const _10MostViewArticles = await articles.load10MostViewArticles(
    `(${[...res.locals.exceptArticles].join(",")})`
  );

  _10MostViewArticles.forEach((record) =>
    res.locals.exceptArticles.add(record["id"])
  );

  const _10LatestArticles = await articles.load10LatestArticles(
    `(${[...res.locals.exceptArticles].join(",")})`
  );

  _10LatestArticles.forEach((record) =>
    res.locals.exceptArticles.add(record["id"])
  );

  const _10EachCategories = await articles.load10EachCategories(
    `(${[...res.locals.exceptArticles].join(",")})`
  );

  res.render("vwHome/home", {
    _4OutstandingArticles,
    _10MostViewArticles,
    _10LatestArticles,
    _10EachCategories,
  });
});

router.get("/search", async (req, res) => {
  const key = decodeURI(req.query.key);

  const data = await articles.fullTextSearch(key);

  res.json(data);
});

router.get("/category-load-more", async (req, res) => {
  const id = +req.query.id;
  const offset = +req.query.offset;

  const categoryName = (await categories.loadCategoryTitle(id))[0];

  if (categoryName["ChuyenMucCon"] === null) {
    res.json(await articles.load7DependCategoryOffset(id, offset * 2));
  } else {
    res.json(await articles.load7DependCategoryOffsetChild(id, offset * 2));
  }
});

router.post("/search-enter", async (req, res) => {
  const searchText = req.body.search;

  const _articles = await articles.fullTextSearchOffset(searchText, 0);

  res.render("vwHome/search-result", {
    _searchText: searchText,
    _articles,
    _offset: 0,
  });
});

router.post("/load-search-area", async (req, res) => {
  const searchText = req.body.searchText;
  const offset = req.body.offset;
  const data = await articles.fullTextSearchOffset(
    searchText,
    (offset + 1) * 2
  );

  res.json(data);
});

router.post("/load-tag-article-area", async (req, res) => {
  const tagName = req.body.tagName;
  const offset = req.body.offset;
  const data = await articles.getArticleDependTag(tagName, (offset + 1) * 2);

  res.json(data);
});

router.get("/check-user-exist", async (req, res) => {
  const email = req.query.email;
  const data = await accounts.accountSingle(email);

  res.send(data);
});

router.post("/login-validate", async (req, res) => {
  const [email, password] = [req.body.email, req.body.password];
  // get user info from mysql db
  const acc = await accounts.accountSingle(email);

  // exist an account with email field equal to `email` variable
  if (acc.length !== 0) {
    if (bcrypt.compareSync(password, acc[0]["MatKhau"])) {
      // password is correct
      return res.json(true);
    }
  }

  // password is incorrect or does not have any account with info which user provides
  return res.json(false);
});

router.get("/reader-allow-access", async (req, res) => {
  const articleID = req.query.id;

  const [timeOut, isPremium] = await Promise.all([
    accounts.readerPremium(
      req.session.isAuthenticated ? req.session.authUser["id"] : -1
    ),
    articles.articlePremium(articleID),
  ]);

  if (+isPremium[0]["IsPremium"] === 0) {
    // this article is not premium
    return res.json(1); // can access
  } else if (+isPremium[0]["IsPremium"] === 1 && req.session.isAuthenticated) {
    // this article is premium
    if (timeOut[0]["ThoiHan"] !== null) {
      const _timeOut = moment(new Date(timeOut[0]["ThoiHan"]));
      const now = moment();

      if (_timeOut >= now) return res.json(1); // can access

      return res.json(0); // can not access since ThoiHan is expired
    } else {
      return res.json(0); // can not access since ThoiHan is expired
    }
  }

  return res.json(-1); // not log in
});

router.post("/article-post-comment", async (req, res) => {
  const entity = {
    NoiDung: req.body.NoiDung,
    BaiVietID: req.body.BaiVietID,
    NgayBinhLuan: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    TaiKhoanID: +req.session.authUser["id"],
  };

  await comments.addComment(entity);

  const [_comments, _quantity] = await Promise.all([
    comments.load5CommentsOffset(+req.body.BaiVietID, 0),
    comments.getCommentsQuantity(+req.body.BaiVietID),
  ]);

  res.json({_comments, _quantity: +_quantity[0]['SoLuong']});
});

module.exports = router;
