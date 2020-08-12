const exphbs = require("express-handlebars");
const hbs_sections = require("express-handlebars-sections");
const moment = require("moment");

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
        },
        formatDate: function (value) {
          const sqlDate = new Date(value);

          return moment(sqlDate).format("DD/MM");
        },
        formatDateTime: function (value) {
          const sqlDate = new Date(value);

          return moment(sqlDate).format("DD/MM/yyyy hh:mm:ss");
        },
        when: function (operand_1, operator, operand_2, options) {
          let operators = {
            eq: (l, r) => l == r,
            noteq: (l, r) => l != r,
            gt: (l, r) => +l > +r,
            gteq: (l, r) => +l > +r || l == r,
            lt: (l, r) => +l < +r,
            lteq: (l, r) => +l < +r || l == r,
            or: (l, r) => l || r,
            and: (l, r) => l && r,
            "%": (l, r) => l % r === 0,
          };
          let result = operators[operator](operand_1, operand_2);
          if (result) return options.fn(this);
          return options.inverse(this);
        },
      },
    })
  );
 
  app.set("view engine", "hbs");
};
