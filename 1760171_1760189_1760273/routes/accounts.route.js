const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const moment = require('moment');

const config = require("../config/default.json");
const accounts = require("../models/accounts.model");
const mdlFunction = require("../middlewares/middle-functions.mdw");

const router = express.Router();

router.post("/register", async (req, res) => {
  const entity = {
    MatKhau: bcrypt.hashSync(
      req.body.password,
      config.authentication.saltRounds
    ),
    HoTen: req.body.name,
    Email: req.body.email,
    VaiTroID: 4,
  };

  await accounts.readerAdding(entity);
  const acc = await accounts.accountSingle(req.body.email);

  delete acc["MatKhau"];

  req.session.isAuthenticated = true;
  req.session.authUser = { id: acc[0]["id"], HoTen: acc[0]["HoTen"], Email: acc[0]["Email"], ButDanh: acc[0]["ButDanh"], NgaySinh: acc[0]["NgaySinh"], ThoiHan: acc[0]["ThoiHan"], TenChuyenMuc: acc[0]["TenChuyenMuc"]  };

  res.redirect(req.headers.referer);
});

router.post("/login", async (req, res) => {
  const acc = await accounts.accountSingle(req.body._email);

  delete acc["MatKhau"];

  req.session.isAuthenticated = true;
  req.session.authUser = { id: acc[0]["id"], HoTen: acc[0]["HoTen"], Email: acc[0]["Email"], ButDanh: acc[0]["ButDanh"], NgaySinh: acc[0]["NgaySinh"], ThoiHan: acc[0]["ThoiHan"], TenChuyenMuc: acc[0]["TenChuyenMuc"] };

  res.redirect(req.headers.referer);
});

// GOOGLE LOGIN
router.get("/google/failed", (req, res) => res.send("Login failed"));
router.get("/google/success", async (req, res) => {
  const email = decodeURI(req.query.email);

  const acc = await accounts.accountSingle(email);

  delete acc["MatKhau"];

  req.session.isAuthenticated = true;
  req.session.authUser = {  id: acc[0]["id"], HoTen: acc[0]["HoTen"], Email: acc[0]["Email"], ButDanh: acc[0]["ButDanh"], NgaySinh: acc[0]["NgaySinh"], ThoiHan: acc[0]["ThoiHan"], TenChuyenMuc: acc[0]["TenChuyenMuc"]  };

  res.redirect("/");
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    prompt: "select_account",
    failureRedirect: "/account/google/failed",
  }),
  function (req, res) {
    res.redirect(`/account/google/success?email=${req.user.Email}`);
  }
);

router.get("/profile", (req, res) => res.render('vwAccount/profile'));
router.get("/profile/edit", (req, res) => res.render('vwAccount/editProfile'));

router.post("/profile/edit", async (req, res) => {
  const NS = moment(req.body.NgaySinh, 'YYYY/MM/DD').format('YYYY/MM/DD');
  var BD = null;
    if(req.body.id == 3){
        BD = req.body.ButDanh;
    }
  const entity = {
    id: req.body.id,
    HoTen: req.body.HoTen,
    ButDanh: BD,
    email: req.body.email,
    NgaySinh: NS
  }
  var a = await accounts.updateAccount(entity);
  if(a != 0){
    req.session.authUser.HoTen = req.body.HoTen;
    req.session.authUser.ButDanh = BD;
    req.session.authUser.Email = req.body.email;
    req.session.authUser.NgaySinh = NS;
  }
  res.redirect('/account/profile');
});

router.get("/logout", mdlFunction.isLoggedIn, (req, res) => {
  req.session.destroy((e) => {
    req.logout();
    res.redirect(req.headers.referer);
  });
});

module.exports = router;
