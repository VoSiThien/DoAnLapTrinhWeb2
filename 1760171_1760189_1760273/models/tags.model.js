const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  loadAllTags: function () {
    return db.load(queries.loadAllTags());
  }
};
