const db = require('../utils/db');
const TBL_BAIVIET = 'BaiViet';
const TBL_TAIKHOAN = 'taikhoan';
const TBL_PHANHOIBAIVIET = 'phanhoibaiviet';
const TBL_ChuyenMuc = 'ChuyenMuc';
module.exports= {
    load: function(){
        return db.load(`select * from ${TBL_BAIVIET} where TrangThaiID = 2`);
    },
    loadByID: function (id) {
        return db.load(`select c.*, t.ButDanh from ${TBL_BAIVIET} c join ${TBL_TAIKHOAN} t where c.id = ${id} and c.TaiKhoanID = t.id`);
    },
    loadDraftPost: function (category) {
        return db.load(`SELECT distinct ${TBL_BAIVIET}.*, ${TBL_TAIKHOAN}.id as 'userID', t2.ButDanh
        FROM ${TBL_BAIVIET},${TBL_TAIKHOAN}, ${TBL_TAIKHOAN} t2
        where ${TBL_BAIVIET}.TrangThaiID = 2 and ${TBL_BAIVIET}.ChuyenMucID = ${TBL_TAIKHOAN}.ChuyenMucQuanLy and ${TBL_TAIKHOAN}.ChuyenMucQuanLy = ${category} and t2.id = ${TBL_BAIVIET}.TaiKhoanID`)
    },
    loadPostbyIDPhanHoi: function (TaiKhoanID) {
        return db.load(`SELECT distinct b.*, p.NoiDung as 'NoiDungPH', t.ButDanh from (${TBL_BAIVIET} b join ${TBL_PHANHOIBAIVIET} p on b.id = p.BaiVietID)
        join ${TBL_TAIKHOAN} t on b.TaiKhoanID = t.id where p.TaiKhoanID = ${TaiKhoanID}`)
    },
    loadByAuthor:function (AuthorID){
        return db.load(`select distinct b.*, p.NoiDung as 'NoiDungPH', t.HoTen, c.TenChuyenMuc from ((${TBL_BAIVIET} b left join ${TBL_PHANHOIBAIVIET} p on b.id = p.BaiVietID)
        left join ${TBL_TAIKHOAN} t on t.id = p.TaiKhoanID) left join ${TBL_ChuyenMuc} c on c.id = b.ChuyenMucID where b.TaiKhoanID = ${AuthorID} order by b.NgayXuatBan desc`);
    },
    getNewestID: function () {
        return db.load(`SELECT MAX(ID) + 1 as newest FROM ${TBL_BAIVIET}`);
    },
    insert: function (entity) {
        return db.add(TBL_BAIVIET, entity);
    },
    update: function (entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.patch(TBL_BAIVIET, entity, condition);
    },
    updateStatus: function (postID, statusID) {
        return db.load(`update ${TBL_BAIVIET} set TrangThaiID = ${statusID} where id = ${postID}`);
    },
    delete: function (id) {
        const condition = { id }
        return db.del(TBL_BAIVIET, condition);
    },
    loadByOffset: (offset) => {
        return db.load(`SELECT * FROM ${TBL_BAIVIET} LIMIT 10 OFFSET ${offset}`)
    },
    quantity: () => {
        return db.load(`select count(*) as quantity from ${TBL_BAIVIET}`)
    }
    ,
    //---------------------------------------------------------------------------------------------------
    updatePulishedDate: function (id) {
        return db.load(`update ${TBL_BAIVIET} set NgayXuatBan = curdate(), TrangThaiID = 3 where id = ${id}`)
    },
    // hien thi 10 bai viet duoc xem nhieu nhat
    loadTop10View: function () {
        return db.load(`select * from ${TBL_BAIVIET} ORDER BY LuotXem DESC LIMIT 10`);
    },
    //hien thi 10 bai moi nhat
    loadTop10New: function () {
        return db.load(`select * from ${TBL_BAIVIET} where NgayXuatBan <= CURDATE() ORDER BY NgayXuatBan DESC LIMIT 10`);
    },
    //hien thi bai viet do phong vien viet
    loadByPosterID: function (id) {
        return db.load(`select * from ${TBL_BAIVIET} where TaiKhoanID = ${id}`);
    },
    //hien thi bai viet thuoc chuyen muc cho bien tap vien
    LoadByCategory: function (ChuyenMucID) {
        return db.load(`select * from ${TBL_BAIVIET} where ChuyenMucID = ${ChuyenMucID} and TrangThaiID = 2`);
    },
    changeTitle:(Title, id) => {
        return db.load(`update baiviet set TieuDe = '${Title}' where id = ${id}`);
    },
    changePhoto:(Photo, id) => {
        return db.load(`update baiviet set HinhAnh = '${Photo}' where id = ${id}`);
    },
    changeShortContent:(ShortContent, id) => {
        return db.load(`update baiviet set NoiDungTat = '${ShortContent}' where id = ${id}`);
    },
    changeContent:(Content, id) => {
        return db.load(`update baiviet set NoiDung = '${Content}' where id = ${id}`);
    },
    changeDatePublish:(DatePublish, id) => {
        return db.load(`update baiviet set NgayXuatBan = '${DatePublish}' where id = ${id}`);
    },
    changeCategoryID:(CategoryID, id) => {
        return db.load(`update baiviet set ChuyenMucID = '${CategoryID}' where id = ${id}`);
    },
    changeStatusID:(StatusID, id) => {
        return db.load(`update baiviet set TrangThaiID = '${StatusID}' where id = ${id}`);
    },
    changePDFs:(PDFs, id) => {
        return db.load(`update baiviet set PDF = '${PDFs}' where id = ${id}`);
    }

}