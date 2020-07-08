const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  load5CommentsOffset: function (id, offset) {
    return db.load(queries.load5CommentsOffset(id, offset));
  }
};
