const exphbs = require("express-handlebars");
const moment = require("moment");
const hbs_sections = require("express-handlebars-sections");

module.exports = function (app) {
  app.engine(
    "hbs",
    exphbs({
      partialsDir: "views/partials",
      defaultLayout: "main.hbs",
      extname: ".hbs",
      helpers: {
        section: hbs_sections(),
        isNull: function(value) {
          return value === null;
        },
        formatDate: function(value) {
          const sqlDate = new Date(value);

          return moment(sqlDate).format('DD/MM');
        }
      }
    })
  );

  app.set("view engine", "hbs");
};
