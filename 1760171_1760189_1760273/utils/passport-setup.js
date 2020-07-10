const config = require("../config/default.json");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.authentication.GOOGLE_CLIENT_ID,
      clientSecret: config.authentication.GOOGLE_CLIENT_SECRET,
      callbackURL: config.authentication.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      // use the profile info (mainly profile id) to check if user is registered in accounts db
      return done(null, profile);
    }
  )
);
