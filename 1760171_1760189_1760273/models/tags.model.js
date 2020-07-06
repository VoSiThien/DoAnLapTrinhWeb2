const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  load20Tags: function () {
    return db.load(queries.load20Tags());
  }
};
