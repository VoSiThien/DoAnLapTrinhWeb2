const config = require("../config/default.json");
const accounts = require("../models/accounts.model");

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
    async (accessToken, refreshToken, profile, done) => {
      const acc = {
        MatKhau: "",
        HoTen: profile._json["name"],
        Email: profile._json["email"],
        VaiTroID: 4,
      };
      
      const userFind = await accounts.accountSingle(acc['Email']);
      
      // this email has not existed in the database
      if (userFind.length === 0) {
        await accounts.readerAdding(acc);

        return done(null, {id: (await accounts.getMaxID())[0]['maxID']});
      } else { // has existed in database
        return done(null, {id: userFind[0]['id']});
      }
    }
  )
);
