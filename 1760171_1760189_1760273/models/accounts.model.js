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
  loadByOffset: (offset) => {
    return db.load(`SELECT * FROM taikhoan LIMIT 5 OFFSET ${offset}`)
  },
  quantity: () => {
    return db.load(`select count(*) as quantity from taikhoan`)
  },
  changeManagedCategory:(catID, userID)=>{
    return db.load(`update taikhoan set chuyenmucquanly = ${catID} where id = ${userID}`)
  },
  changeRole:(roleID, userID) => {
    return db.load(`update taikhoan set vaitroid = '${roleID}' where id = ${userID}`);
  },
  changeDate:(date, userID)=> {
    return db.load(`update taikhoan set thoihan = '${date}' where id = ${userID}`);
  },
  changeAthName:(name, userID)=> {
    return db.load(`update taikhoan set butdanh = '${name}' where id = ${userID}`);
  },
  loadByAthName:(name)=> {
    return db.load(`select * from taikhoan where butdanh = '${name}'`);
  }
};
