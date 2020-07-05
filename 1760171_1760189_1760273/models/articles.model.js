const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  load4OutstandingPosts: function () {
    return db.load(queries.load4OutstandingArticles());
  },
};
