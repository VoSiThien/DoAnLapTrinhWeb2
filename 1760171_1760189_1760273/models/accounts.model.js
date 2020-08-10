const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  load: function (username) {
    return db.load(`select * from taikhoan`)
  },
  accountSingle: function (email) {
    return db.load(queries.accountSingle(email));
  },

  readerPremium: function (id) {
    return db.load(queries.readerPremium(id));
  },

  readerAdding: function (entity) {
    return db.add('taikhoan', entity);
  }
};
