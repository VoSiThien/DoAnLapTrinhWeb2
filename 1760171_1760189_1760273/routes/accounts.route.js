const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const config = require("../config/default.json");
const accounts = require("../models/accounts.model");

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: config.authentication.CLIENT_ID,
      clientSecret: config.authentication.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/account/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

router.use

router.get("/google/failed", (req, res) => res.send("Login failed"));
router.get("/google/success", (req, res) => res.send("Login success"));

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/account/google/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/account/google/success");
  }
);

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

module.exports = router;
