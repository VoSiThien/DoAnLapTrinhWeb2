const session = require("express-session");

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  NODE_ENV = "development",
  SESS_NAME = "sid",
  SESS_SECRET = "ssh!quiet,it'asecret!",
  SESS_LIFETIME = TWO_HOURS,
} = process.env;

const IN_PROD = NODE_ENV === "production";

module.exports = function (app) {
  app.use(
    session({
      name: SESS_NAME,
      resave: false,
      saveUninitialized: false,
      secret: SESS_SECRET,
      cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD,
      },
    })
  );
};
