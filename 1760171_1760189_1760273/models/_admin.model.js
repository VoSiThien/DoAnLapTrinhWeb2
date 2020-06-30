const db = require('../utils/db');
const TBL_CHUYENMUC = 'ChuyenMuc';
const TBL_TAG = 'Tag';
const TBL_BAIVIET = 'BaiViet';
const TBL_TAIKHOAN = 'TaiKhoan';
const TBL_BINHLUAN = 'BinhLuan';
const TBL_PHANHOIBAIVIET = 'PhanHoiBaiViet';
const TBL_VAITRO = 'VaiTro';
module.exports = {
    //-----------------------------Chuyen muc
    LoadChuyenMuc: function(){
        return db.load(`select * from ${TBL_CHUYENMUC}`);
    },
    InsertChuyeMuc: function(entity){
        return db.add(TBL_CHUYENMUC, entity);
    },
    UpdateChuyenMuc: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_CHUYENMUC, entity, condition);
    },
    DeleteChuyenMuc: function(id){
        const condition = { id }
        return db.del(TBL_CHUYENMUC, condition);
    },
    DeleteChuyenMucCon: function(id){
        const condition = { ChuyenMucCon: id }
        return db.del(TBL_CHUYENMUC, condition);
    },
    LoadChuyenMucCha: function(){
        return db.load(`select * from ${TBL_CHUYENMUC} where ChuyenMucCon is null`);
    },
    LoadChuyenMucByID: function(id){
        return db.load(`select * from ${TBL_CHUYENMUC} where id = ${id}`);
    },
    //-----------------------------Tag
    LoadTag: function(){
        return db.load(`select * from ${TBL_TAG}`);
    },
    InsertTag: function(entity){
        return db.add(TBL_TAG, entity);
    },
    UpdateTag: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_TAG, entity, condition);
    },
    DeleteTag: function(id){
        const condition = { id }
        return db.del(TBL_TAG, condition);
    },
    LoadTagByID: function(id){
        return db.load(`select * from ${TBL_TAG} where id = ${id}`);
    },
    //-----------------------------Bai Viet
    LoadBaiViet: function(){
        return db.load(`select * from ${TBL_BAIVIET} where TrangThaiID = 2`);
    },
    InsertBaiViet: function(entity){
        return db.add(TBL_BAIVIET, entity);
    },
    UpdateBaiViet: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_BAIVIET, entity, condition);
    },
    DeleteBaiViet: function(id){
        const condition = { id }
        return db.del(TBL_BAIVIET, condition);
    },
    LoadBaiVietByID: function(id){
        return db.load(`select c.*, t.ButDanh from ${TBL_BAIVIET} c join ${TBL_TAIKHOAN} t where c.id = ${id} and c.TaiKhoanID = t.id`);
    },
    UpdateBaiVietXuatBan: function(id){
        return db.load(`update ${TBL_BAIVIET} set NgayXuatBan = curdate(), TrangThaiID = 3 where id = ${id}`)
    },
    // hien thi 10 bai viet duoc xem nhieu nhat
    Top10View: function(){
        return db.load(`select * from ${TBL_BAIVIET} ORDER BY LuotXem DESC LIMIT 10`);
    },
    //hien thi 10 bai moi nhat
    Top10New: function(){
        return db.load(`select * from ${TBL_BAIVIET} where NgayXuatBan <= CURDATE() ORDER BY NgayXuatBan DESC LIMIT 10`);
    },
    //hien thi bai viet do phong vien viet
    LoadBaiVietPhongVien: function(id){
        return db.load(`select * from ${TBL_BAIVIET} where TaiKhoanID = ${id}`);
    },
    //hien thi bai viet thuoc chuyen muc cho bien tap vien
    LoadBaiVietPhongVien: function(ChuyenMucID){
        return db.load(`select * from ${TBL_BAIVIET} where ChuyenMucID = ${ChuyenMucID} and TrangThaiID = 2`);
    },
    //-----------------------------Tai khoan
    LoadTaiKhoan: function(id){
        return db.load(`select t.*, v.TenVaiTro from ${TBL_TAIKHOAN} t join ${TBL_VAITRO} v where t.VaiTroID = ${id} and t.VaiTroID = v.id`);
    },
    LoadBienTapVien: function(id){
        return db.load(`select t.*, v.TenVaiTro, c.TenChuyenMuc from ${TBL_TAIKHOAN} t join ${TBL_VAITRO} v join ${TBL_CHUYENMUC} c where t.VaiTroID = ${id} and t.ChuyenMucQuanLy = c.id and t.VaiTroID = v.id`);
    },
    LoadTaiKhoanByID: function(id){
        return db.load(`select * from ${TBL_TAIKHOAN} where id = ${id}`);
    },
    InsertTaiKhoan: function(entity){
        return db.add(TBL_TAIKHOAN, entity);
    },
    UpdateTaiKhoan: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_TAIKHOAN, entity, condition);
    },
    DeleteTaiKhoan: function(id){
        const condition = { id }
        return db.del(TBL_TAIKHOAN, condition);
    },
    //-----------------------------Binh Luan
    LoadBinhLuan: function(){
        return db.load(`select * from ${TBL_BINHLUAN}`);
    },
    InsertBinhLuan: function(entity){
        return db.add(TBL_BINHLUAN, entity);
    },
    UpdateBinhLuan: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_BINHLUAN, entity, condition);
    },
    DeleteBinhLuan: function(id){
        const condition = { id }
        return db.del(TBL_BINHLUAN, condition);
    },
    //-----------------------------Phan hoi bai viet
    LoadPhanHoiBaiViet: function(){
        return db.load(`select * from ${TBL_PHANHOIBAIVIET}`);
    },
    InsertPhanHoiBaiViet: function(entity){
        return db.add(TBL_PHANHOIBAIVIET, entity);
    },
    UpdatePhanHoiBaiViet: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_PHANHOIBAIVIET, entity, condition);
    },
    DeletePhanHoiBaiViet: function(id){
        const condition = { id }
        return db.del(TBL_PHANHOIBAIVIET, condition);
    },
}