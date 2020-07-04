const exphbs = require("express-handlebars");
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
        isNull: function (value) {
          return value === null;
        },
        isEqual: function (a,b){
          return a == b;
        },
        isNotEqual: function(a, b){
          return a != b;
        }
      }
    })
  );
 
  app.set("view engine", "hbs");
};
