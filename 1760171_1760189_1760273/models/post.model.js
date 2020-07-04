const db = require('../utils/db');
const TBL_BAIVIET = 'BaiViet';
const TBL_TAIKHOAN = 'taikhoan'
module.exports= {
    load: function(){
        return db.load(`select * from ${TBL_BAIVIET} where TrangThaiID = 2`);
    },
    loadByID: function(id){
        return db.load(`select c.*, t.ButDanh from ${TBL_BAIVIET} c join ${TBL_TAIKHOAN} t where c.id = ${id} and c.TaiKhoanID = t.id`);
    },
    loadDraftPost: function(category){
         return db.load(`SELECT distinct ${TBL_BAIVIET}.*, ${TBL_TAIKHOAN}.id as 'userID', ${TBL_TAIKHOAN}.ButDanh 
        FROM ${TBL_BAIVIET},${TBL_TAIKHOAN}
        where ${TBL_BAIVIET}.TrangThaiID = 2 and ${TBL_BAIVIET}.ChuyenMucID = ${TBL_TAIKHOAN}.ChuyenMucQuanLy and ${TBL_TAIKHOAN}.ChuyenMucQuanLy = ${category}`)
    },
    loadByAuthor:function (AuthorID){
        console.log(`select * from ${TBL_BAIVIET} where TaiKhoanID = ${AuthorID} order by NgayXuatBan desc`);
        return db.load(`select * from ${TBL_BAIVIET} where TaiKhoanID = ${AuthorID} order by NgayXuatBan desc`);
    },
    getNewestID: function(){
        return db.load(`SELECT MAX(ID) + 1 as newest FROM ${TBL_BAIVIET}`);
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
    updateStatus:function(postID, statusID){
        return db.load(`update ${TBL_BAIVIET} set TrangThaiID = ${statusID} where id = ${postID}`);
    },
    delete: function(id){
        const condition = { id }
        return db.del(TBL_BAIVIET, condition);
    },
    
    //---------------------------------------------------------------------------------------------------
    updatePulishedDate: function(id){
        return db.load(`update ${TBL_BAIVIET} set NgayXuatBan = curdate(), TrangThaiID = 3 where id = ${id}`)
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