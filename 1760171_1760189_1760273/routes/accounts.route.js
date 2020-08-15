const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const moment = require('moment');

const config = require("../config/default.json");
const accounts = require("../models/accounts.model");
const mdlFunction = require("../middlewares/middle-functions.mdw");
const SendOtp = require('sendotp');
const nodemailer = require('nodemailer');
const path = require("path");

const router = express.Router();


router.post("/register", async (req, res) => {
  const time = await accounts.gettime();
  const entity = {
    username: req.body.username,
    MatKhau: bcrypt.hashSync(
      req.body.password,
      config.authentication.saltRounds
    ),
    HoTen: req.body.name,
    Email: req.body.email,
    ThoiHan: time[0]["thoigian"],
    VaiTroID: 4,
  };

  await accounts.readerAdding(entity);

  const acc = await accounts.accountSingle(req.body.email);

  delete acc["MatKhau"];

  const NS = moment(acc[0]["NgaySinh"], 'YYYY/MM/DD').format('YYYY/MM/DD');
  const TH = moment(acc[0]["ThoiHan"], 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS');
  req.session.isAuthenticated = true;
  req.session.authUser = {
    username: acc[0]["username"], id: acc[0]["id"], HoTen: acc[0]["HoTen"], Email: acc[0]["Email"], ButDanh: acc[0]["ButDanh"], NgaySinh: NS, ThoiHan: TH, TenChuyenMuc: acc[0]["TenChuyenMuc"], VaiTroID: acc[0]["VaiTroID"],
    ChuyenMucQuanLy: acc[0]["ChuyenMucQuanLy"]
  };

  res.redirect(req.headers.referer);
});

router.post("/login", async (req, res) => {
  const acc = await accounts.accountSingleUser(req.body._username);

  delete acc["MatKhau"];

  const NS = moment(acc[0]["NgaySinh"], 'YYYY/MM/DD').format('YYYY/MM/DD');
  const TH = moment(acc[0]["ThoiHan"], 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS');

  req.session.isAuthenticated = true;
  req.session.authUser = {
    username: acc[0]["username"], id: acc[0]["id"], HoTen: acc[0]["HoTen"], Email: acc[0]["Email"], ButDanh: acc[0]["ButDanh"], NgaySinh: NS, ThoiHan: TH, TenChuyenMuc: acc[0]["TenChuyenMuc"], VaiTroID: acc[0]["VaiTroID"],
    ChuyenMucQuanLy: acc[0]["ChuyenMucQuanLy"]
  };

  res.redirect(req.headers.referer);
});

// GOOGLE LOGIN
router.get("/google/failed", (req, res) => res.send("Login failed"));
router.get("/google/success", async (req, res) => {
  const email = decodeURI(req.query.email);

  const acc = await accounts.accountSingle(email);

  delete acc["MatKhau"];

  const NS = moment(acc[0]["NgaySinh"], 'YYYY/MM/DD').format('YYYY/MM/DD');
  const TH = moment(acc[0]["ThoiHan"], 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS');

  req.session.isAuthenticated = true;
  req.session.authUser = {
    username: acc[0]["username"], id: acc[0]["id"], HoTen: acc[0]["HoTen"], Email: acc[0]["Email"], ButDanh: acc[0]["ButDanh"], NgaySinh: NS, ThoiHan: TH, TenChuyenMuc: acc[0]["TenChuyenMuc"], VaiTroID: acc[0]["VaiTroID"],
    ChuyenMucQuanLy: acc[0]["ChuyenMucQuanLy"]
  };

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
  const NS = moment(req.body.pNgaySinh, 'YYYY/MM/DD').format('YYYY/MM/DD');
  var BD = null;
  if (req.body.id == 3) {
    BD = req.body.ButDanh;
  }
  const entity = {
    id: req.body.id,
    username: req.body.pusername,
    HoTen: req.body.HoTen,
    ButDanh: BD,
    email: req.body.pemail,
    NgaySinh: NS
  }
  var a = await accounts.updateAccount(entity);
  if (a != 0) {
    req.session.authUser.username = req.body.pusername;
    req.session.authUser.HoTen = req.body.HoTen;
    req.session.authUser.ButDanh = BD;
    req.session.authUser.Email = req.body.pemail;
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

//Doi mat khau
router.get("/password/edit", (req, res) => res.render('vwAccount/editPassword'));
router.post("/password/edit", async (req, res) => {
  const entity = {
    id: req.body.id,
    MatKhau: bcrypt.hashSync(
      req.body.newPassword,
      config.authentication.saltRounds
    )
  }
  await accounts.updateAccount(entity);
  res.redirect('/account/profile');
  res.redirect(req.headers.referer);
});

//nhap email 
router.post("/check-email", async (req, res) => {
  const email = req.body.email;
  const emailCheck = await accounts.accountSingle(email);
  if (emailCheck.length !== 0) {
    return res.json(true);
  }
  return res.json(false);
});
//check ma xac nhan
router.post("/check-VerificationCode", async (req, res) => {
  const acc = await accounts.accountSingle(req.session.authUser.Email);
  const MaXacNhan = req.body.MaXacNhan;
  if (acc[0]["MaXacNhan"] === MaXacNhan) {
    return res.json(true);
  }
  return res.json(false);
});

router.get("/ConfirmEmail", (req, res) => {
  res.render('vwAccount/ConfirmEmail');
});

router.post("/ConfirmEmail", async (req, res) => {
  const acc = await accounts.accountSingle(req.body.Cemail);

  delete acc["MatKhau"];

  req.session.authUser = { id: acc[0]["id"], HoTen: acc[0]["HoTen"], Email: acc[0]["Email"] };
  res.redirect('/account/VerificationCode');
});

//nhap ma xac nhan email
router.get("/VerificationCode", async (req, res) => {

  //var b = Math.random().toString(36).replace(/[^0-9]+/g, '').substr(0, 5);
  var b = (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString();
  var transporter = nodemailer.createTransport('smtps://vsthien1212%40gmail.com:thien123456@smtp.gmail.com');

  var mailOptions = {
    from: '<vsthien1212@gmail.com>',
    to: `${req.session.authUser.Email}`,
    subject: 'Xác nhận Email',
    html: `<h1>Chào ban đây là mã xác nhập của bạn</h1><br> <h3>${b}</h3>`
    //text: `1234sdadsa sad ${a}`
  };

  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
    } else {
      const entity = {
        id: req.session.authUser.id,
        MaXacNhan: b
      }
      await accounts.updateAccount(entity);
      res.render('vwAccount/VerificationCode')
      //console.log('Email sent: ' + info.response);
    }
  });
});

//nhap ma xac nhan
router.post("/VerificationCode", async (req, res) => {
  const entity = {
    id: req.session.authUser.id,
    MaXacNhan: null
  }
  await accounts.updateAccount(entity);
  res.redirect('/account/ForgotPassword')
});
//nhap mat khau moi
router.get("/ForgotPassword", async (req, res) => {
  res.render('vwAccount/ForgotPassword');
});
//nhap mat khau moi
router.post("/ForgotPassword", async (req, res) => {
    const entity = {
      id: req.body.id,
      MatKhau: bcrypt.hashSync(
        req.body.nPassword,
        config.authentication.saltRounds
      )
    }
    var a = await accounts.updateAccount(entity);
    res.redirect('/');
});

//gia han tai khoan
router.get("/AddLimits", async (req, res) => {
  await accounts.AddLimits(req.session.authUser.id);
  const acc = await accounts.accountSingle(req.session.authUser.Email);

  delete acc["MatKhau"];
  const TH = moment(acc[0]["ThoiHan"], 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS');
  req.session.authUser.ThoiHan = TH;
  res.redirect(req.headers.referer);
});

module.exports = router;
