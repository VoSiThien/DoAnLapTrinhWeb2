const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  load5CommentsOffset: function (id, offset) {
    return db.load(queries.load5CommentsOffset(id, offset));
  },

  getCommentsQuantity: function (id) {
    return db.load(queries.getCommentsQuantity(id));
  },

  addComment: function (entity) {
    return db.add('binhluan', entity);
  }
};
