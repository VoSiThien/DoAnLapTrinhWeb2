const db = require('../utils/db');
const TBL_BAIVIET = 'BaiViet';

module.exports= {
    load: function(){
        return db.load(`select * from ${TBL_BAIVIET} where TrangThaiID = 2`);
    },
    loadByID: function(id){
        return db.load(`select c.*, t.ButDanh from ${TBL_BAIVIET} c join ${TBL_TAIKHOAN} t where c.id = ${id} and c.TaiKhoanID = t.id`);
    },
    insert: function(entity){
        return db.add(TBL_BAIVIET, entity);
    },
    update: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_BAIVIET, entity, condition);
    },
    updatePulishedDate: function(id){
        return db.load(`update ${TBL_BAIVIET} set NgayXuatBan = curdate(), TrangThaiID = 3 where id = ${id}`)
    },
    delete: function(id){
        const condition = { id }
        return db.del(TBL_BAIVIET, condition);
    },
    
    
    
    // hien thi 10 bai viet duoc xem nhieu nhat
    loadTop10View: function(){
        return db.load(`select * from ${TBL_BAIVIET} ORDER BY LuotXem DESC LIMIT 10`);
    },
    //hien thi 10 bai moi nhat
    loadTop10New: function(){
        return db.load(`select * from ${TBL_BAIVIET} where NgayXuatBan <= CURDATE() ORDER BY NgayXuatBan DESC LIMIT 10`);
    },
    //hien thi bai viet do phong vien viet
    loadByPosterID: function(id){
        return db.load(`select * from ${TBL_BAIVIET} where TaiKhoanID = ${id}`);
    },
    //hien thi bai viet thuoc chuyen muc cho bien tap vien
    LoadByCategory: function(ChuyenMucID){
        return db.load(`select * from ${TBL_BAIVIET} where ChuyenMucID = ${ChuyenMucID} and TrangThaiID = 2`);
    }
}