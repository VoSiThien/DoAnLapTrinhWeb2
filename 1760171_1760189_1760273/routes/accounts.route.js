const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const config = require("../config/default.json");
const accounts = require("../models/accounts.model");

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

  res.send("Register email success");
});

router.post("/login", async (req, res) => {
  const acc = await accounts.accountSingle(req.body._email);

  delete acc["MatKhau"];

  req.session.isAuthenticated = true;
  req.session.authUser = { id: acc[0]["id"], HoTen: acc[0]["HoTen"] };

  res.redirect("/");
});

// GOOGLE LOGIN
router.get("/google/failed", (req, res) => res.send("Login failed"));
router.get("/google/success", async (req, res) => {
  const email = decodeURI(req.query.email);

  const acc = await accounts.accountSingle(email);

  delete acc["MatKhau"];

  req.session.isAuthenticated = true;
  req.session.authUser = { id: acc[0]["id"], HoTen: acc[0]["HoTen"] };

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

router.get("/profile", (req, res) => res.send("You are login!"));

router.get("/logout", (req, res) => {
  req.session.destroy((e) => {
    req.logout();
    res.redirect("/account/profile");
  });
});

module.exports = router;
