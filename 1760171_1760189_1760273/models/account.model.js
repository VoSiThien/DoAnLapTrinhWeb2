const db = require('../utils/db');

const TBL_ACCOUNT = 'TaiKhoan';
const TBL_VAITRO = 'VaiTro';
const TBL_CATEGORIES = 'ChuyenMuc';

module.exports = {
    load: function () {
        return db.load(`select t.*, v.TenVaiTro, c.TenChuyenMuc from (${TBL_ACCOUNT} t join ${TBL_VAITRO} v) left join ${TBL_CATEGORIES} c on t.ChuyenMucQuanLy = c.id where t.VaiTroID = v.id`)
    },
    loadByID: function (ID) {
        return db.load(`select * from ${TBL_ACCOUNT} where id = '${ID}'`)
    },
    loadUser: function (username) {
        return db.load(`select * from ${TBL_ACCOUNT} where tentaikhoan = '${username}'`)
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

