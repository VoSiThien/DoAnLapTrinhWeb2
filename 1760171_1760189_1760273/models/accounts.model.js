const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  load: function () {
    return db.load(`select taikhoan.* from taikhoan`)
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
