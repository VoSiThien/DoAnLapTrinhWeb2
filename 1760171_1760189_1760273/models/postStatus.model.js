const db = require('../utils/db');

const TBL_STATUS = 'trangthai'

module.exports = {
    load:function(postID){
        return db.load(`Select trangthai.tentrangthai as TenTrangThai from trangthai, baiviet where trangthai.id = baiviet.trangthaiid and baiviet.id = ${postID}`)
    }
}

