const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  accountSingle: function (email) {
    return db.load(queries.accountSingle(email));
  },

  readerAdding: function (entity) { 
    return db.add('taikhoan', entity);
  },
};
