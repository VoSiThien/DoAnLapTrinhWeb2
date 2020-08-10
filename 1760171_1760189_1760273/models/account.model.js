const db = require('../utils/db');

const TBL_ACCOUNT = 'TaiKhoan'

module.exports = {
    load: function (username) {
        return db.load(`select * from ${TBL_ACCOUNT}`)
    },
    loadByID: function (ID) {
        return db.load(`select * from ${TBL_ACCOUNT} where id = '${ID}'`)
    },
    loadUser: function (username, password) {
        return db.load(`select * from ${TBL_ACCOUNT} where tentaikhoan = '${username}' and matkhau = '${password}'`)
    },
    loadReporter: function(){
        return db.load(`select * from ${TBL_ACCOUNT} where vaitroID  = 3`);
    },
    add: function (entity) {
        return db.add(TBL_ACCOUNT, entity);
    },
    update: function (entity) {
        const condition = {
            username: entity.username
        }
        delete entity.id;
        return db.update(TBL_ACCOUNT, entity, condition);
    }
}

