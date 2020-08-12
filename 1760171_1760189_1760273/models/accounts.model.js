const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  load: function () {
    return db.load(`select taikhoan.* from taikhoan`)
  },
  loadbyID: function(id){
    return db.load(`select taikhoan.* from taikhoan where id = ${id}`)
  },
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
  },
  loadByOffset: (offset) => {
    return db.load(`SELECT * FROM taikhoan LIMIT 5 OFFSET ${offset}`)
  },
  quantity: () => {
    return db.load(`select count(*) as quantity from taikhoan`)
  },
  changeManagedCategory:()=>{}
};
