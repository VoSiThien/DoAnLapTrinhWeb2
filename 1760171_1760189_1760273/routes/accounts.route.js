const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
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
});

// GOOGLE LOGIN
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

router.get("/google/failed", (req, res) => res.send("Login failed"));
router.get("/google/success", isLoggedIn, (req, res) => {
  res.send(`Welcome ${req.user._json['email']}`);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/account/google/failed",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/account/google/success");
  }
);

router.get("/profile", (req, res) => res.send("You are not login!"));

router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/account/profile");
});

module.exports = router;
