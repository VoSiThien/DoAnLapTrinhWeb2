const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  accountSingle: function (email) {
    return db.load(queries.accountSingle(email));
  },

  readerPremium: function (id) {
    return db.load(queries.readerPremium(id));
  },

  readerAdding: function (entity) {
    return db.add('taikhoan', entity);
  },
  updateAccount: function (entity) {
    const condition = {
      id: entity.id
    }
    delete entity.id;
    return db.patch('taikhoan', entity, condition);

  },
  gettime: function () {
    return db.load(queries.gettime());
  },
  AddLimits: function(id){
    return db.load(queries.AddLimits(id));
  }
};
