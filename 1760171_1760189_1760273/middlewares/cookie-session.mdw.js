const cookieSession = require("cookie-session");

module.exports = function (app) {
  app.use(cookieSession({
    name: 'team_19-session',
    keys: ['key1', 'key2']
  }));
};
