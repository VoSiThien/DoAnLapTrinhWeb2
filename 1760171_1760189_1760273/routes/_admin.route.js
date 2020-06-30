const express = require('express');
const adminmodel = require('../models/admin.model');
const moment = require('moment');

const router = express.Router();

router.get('/', async function (req, res) {
    const newLocal = 'vwadmin/admin';
    res.render(newLocal);
});
//---------------------- chuyen muc
router.get('/QLChuyenMuc', async function (req, res) {
    const list = await adminmodel.LoadChuyenMuc();
    const newLocal = 'vwadmin/QLChuyenMuc';
    res.render(newLocal, {lists: list});
});
router.get('/QLChuyenMuc/add', async function (req, res) {
    const ChuyenMuc = await adminmodel.LoadChuyenMucCha();
    const newLocal = 'vwadmin/ChuyenMuc/add';
    res.render(newLocal, {ChuyenMucCha: ChuyenMuc});
});
router.post('/QLChuyenMuc/StartAdd', async function (req, res) {
    var check = req.body.ChuyenMucCha;
    if(req.body.attend != null)
    {
        check = null;
    }
    const body = {
        TenChuyenMuc: req.body.TenChuyenMuc,
        ChuyenMucCon: check
    }
    await adminmodel.InsertChuyeMuc(body);
    res.redirect('/admin/QLChuyenMuc/add');
});
router.get('/QLChuyenMuc/edit/:id', async function (req, res) {
    const id = +req.params.id || -1;
    const ChuyenMuc = await adminmodel.LoadChuyenMucCha();
    const rows = await adminmodel.LoadChuyenMucByID(id);
    const row = rows[0];
    const newLocal = 'vwadmin/ChuyenMuc/edit';
    res.render(newLocal, {ChuyenMucCha: ChuyenMuc, row});
});
router.post('/QLChuyenMuc/Startedit', async function (req, res) {
    var check = req.body.ChuyenMucCha;
    if(req.body.attend != null)
    {
        check = null;
    }
    const body = {
        TenChuyenMuc: req.body.TenChuyenMuc,
        ChuyenMucCon: check,
        id: req.body.id
    }
    await adminmodel.UpdateChuyenMuc(body);
    res.redirect('/admin/QLChuyenMuc');
});
router.get('/QLChuyenMuc/del/:id', async function (req, res) {
    const id = +req.params.id || -1;
    await adminmodel.DeleteChuyenMucCon(id);
    await adminmodel.DeleteChuyenMuc(id);
    res.redirect('/admin/QLChuyenMuc');
});
//---------------------- Tag
router.get('/QLTag', async function (req, res) {
    const list = await adminmodel.LoadTag();
    const newLocal = 'vwadmin/QLTag';
    res.render(newLocal, {lists: list});
});
router.get('/QLTag/add', async function (req, res) {
    const newLocal = 'vwadmin/Tag/add';
    res.render(newLocal);
});
router.post('/QLTag/StartAdd', async function (req, res) {
    const body = {
        TenTag: req.body.TenTag
    }
    await adminmodel.InsertTag(body);
    res.redirect('/admin/QLTag/add');
});
router.get('/QLTag/edit/:id', async function (req, res) {
    const id = +req.params.id || -1;
    const rows = await adminmodel.LoadTagByID(id);
    const row = rows[0];
    const newLocal = 'vwadmin/Tag/edit';
    res.render(newLocal, {row});
});
router.post('/QLTag/Startedit', async function (req, res) {
    const body = {
        TenTag: req.body.TenTag,
        id: req.body.id
    }
    await adminmodel.UpdateTag(body);
    res.redirect('/admin/QLTag');
});
router.get('/QLTag/del/:id', async function (req, res) {
    const id = +req.params.id || -1;
    await adminmodel.DeleteTag(id);
    res.redirect('/admin/QLTag');
});
//------------------------------ Bai viet
router.get('/QLBaiViet', async function (req, res) {
    const list = await adminmodel.LoadBaiViet();
    const newLocal = 'vwadmin/QLBaiViet';
    res.render(newLocal, {lists: list});
});
router.get('/QLBaiViet/detail/:id', async function (req, res) {
    const id = +req.params.id || -1;
    const rows = await adminmodel.LoadBaiVietByID(id);
    const row = rows[0];
    const newLocal = 'vwadmin/BaiViet/Detail';
    res.render(newLocal, {row});
});
router.get('/QLBaiViet/XuatBan/:id', async function (req, res) {
    const id = +req.params.id || -1;
    await adminmodel.UpdateBaiVietXuatBan(id);
    res.redirect('/admin/QLBaiViet');
});
//------------------------ tai khoan
// router.get('/QLBienTapVien', async function (req, res) { 
//     const id = 2;
//     const list = await adminmodel.LoadBienTapVien(id);
//     for(var i = 0; i < list.length ; i++){
//         list[i].NgaySinh = moment(list[i].NgaySinh, 'YYYY/MM/DD').format('YYYY/MM/DD');
//     }
//     const newLocal = 'vwadmin/QLBienTapVien';
//     res.render(newLocal, {lists: list});
// });
router.get('/QLBienTapVien/add', async function (req, res) {   
    const list = await adminmodel.LoadChuyenMuc();
    const newLocal = 'vwadmin/BienTapVien/add';
    res.render(newLocal, {lists: list});
});
router.get('/QLBienTapVien/edit/:id', async function (req, res) {
    const id = +req.params.id || -1;
    const list = await adminmodel.LoadChuyenMuc();
    const rows = await adminmodel.LoadTaiKhoanByID(id);
    const row = rows[0];
    row.NgaySinh = moment(row.NgaySinh, 'YYYY/MM/DD').format('YYYY-MM-DD');
    const newLocal = 'vwadmin/BienTapVien/edit';
    res.render(newLocal, {lists: list, row});
});
router.post('/QLBienTapVien/StartAdd', async function (req, res) {
    const NS =  moment(req.body.NgaySinh , 'YYYY-MM-DD').format('YYYY/MM/DD');
    const body = {
        TenTaiKhoan: req.body.TenTaiKhoan,
        MatKhau: req.body.MatKhau,
        HoTen: req.body.HoTen,
        email: req.body.email,
        NgaySinh: NS,
        ThoiHan: '2020-12-30 00:00:00',
        VaiTroID: 2,
        ChuyenMucQuanLy: req.body.ChuyenMucQuanLy
    }
    await adminmodel.InsertTaiKhoan(body);
    res.redirect('/admin/QLBienTapVien/add');
});
router.post('/QLBienTapVien/Startedit', async function (req, res) {
    const NS =  moment(req.body.NgaySinh , 'YYYY-MM-DD').format('YYYY/MM/DD');
    const body = {
        id: req.body.id,
        TenTaiKhoan: req.body.TenTaiKhoan,
        MatKhau: req.body.MatKhau,
        HoTen: req.body.HoTen,
        email: req.body.email,
        NgaySinh: NS,
        ThoiHan: '2020-12-30 00:00:00',
        VaiTroID: 2,
        ChuyenMucQuanLy: req.body.ChuyenMucQuanLy
    }
    await adminmodel.UpdateTaiKhoan(body);
    res.redirect('/admin/QLTaiKhoan');
});
router.get('/QLBienTapVien/del/:id', async function (req, res) {
    const id = +req.params.id || -1;
    await adminmodel.DeleteTaiKhoan(id);
    res.redirect('/admin/QLTaiKhoan');
});
// router.get('/QLPhongVien', async function (req, res) {
//     const id = 3;
//     const list = await adminmodel.LoadTaiKhoan(id);
//     for(var i = 0; i < list.length ; i++){
//         list[i].NgaySinh = moment(list[i].NgaySinh, 'YYYY/MM/DD').format('YYYY/MM/DD');
//     }
//     const newLocal = 'vwadmin/QLPhongVien';
//     res.render(newLocal, {lists: list});
// });
router.get('/QLPhongVien/add', async function (req, res) {   
    const newLocal = 'vwadmin/PhongVien/add';
    res.render(newLocal);
});
router.get('/QLPhongVien/edit/:id', async function (req, res) {
    const id = +req.params.id || -1;
    const rows = await adminmodel.LoadTaiKhoanByID(id);
    const row = rows[0];
    row.NgaySinh = moment(row.NgaySinh, 'YYYY/MM/DD').format('YYYY-MM-DD');
    const newLocal = 'vwadmin/PhongVien/edit';
    res.render(newLocal, {row});
});
router.post('/QLPhongVien/StartAdd', async function (req, res) {
    const NS =  moment(req.body.NgaySinh , 'YYYY-MM-DD').format('YYYY/MM/DD');
    const body = {
        TenTaiKhoan: req.body.TenTaiKhoan,
        MatKhau: req.body.MatKhau,
        HoTen: req.body.HoTen,
        ButDanh: req.body.ButDanh,
        email: req.body.email,
        NgaySinh: NS,
        VaiTroID: 3
    }
    await adminmodel.InsertTaiKhoan(body);
    res.redirect('/admin/QLPhongVien/add');
});
router.post('/QLPhongVien/Startedit', async function (req, res) {
    const NS =  moment(req.body.NgaySinh , 'YYYY-MM-DD').format('YYYY/MM/DD');
    const body = {
        id: req.body.id,
        TenTaiKhoan: req.body.TenTaiKhoan,
        MatKhau: req.body.MatKhau,
        ButDanh: req.body.ButDanh,
        HoTen: req.body.HoTen,
        email: req.body.email,
        NgaySinh: NS,
        VaiTroID: 3
    }
    await adminmodel.UpdateTaiKhoan(body);
    res.redirect('/admin/QLTaiKhoan');
});
router.get('/QLPhongVien/del/:id', async function (req, res) {
    const id = +req.params.id || -1;
    await adminmodel.DeleteTaiKhoan(id);
    res.redirect('/admin/QLTaiKhoan');
});

// router.get('/QLDocGia', async function (req, res) {
//     const id = 4;
//     const list = await adminmodel.LoadTaiKhoan(id);
//     for(var i = 0; i < list.length ; i++){
//         list[i].NgaySinh = moment(list[i].NgaySinh, 'YYYY/MM/DD').format('YYYY/MM/DD');
//         list[i].ThoiHan = moment(list[i].ThoiHan, 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS');
//     }
//     const newLocal = 'vwadmin/QLDocGia';
//     res.render(newLocal, {lists: list});
// });
router.get('/QLDocGia/add', async function (req, res) {   
    const newLocal = 'vwadmin/DocGia/add';
    res.render(newLocal);
});
router.get('/QLDocGia/edit/:id', async function (req, res) {
    const id = +req.params.id || -1;
    const rows = await adminmodel.LoadTaiKhoanByID(id);
    const row = rows[0];
    row.NgaySinh = moment(row.NgaySinh, 'YYYY/MM/DD').format('YYYY-MM-DD');
    row.ThoiHan = moment(row.ThoiHan, 'YYYY/MM/DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS');
    const newLocal = 'vwadmin/DocGia/edit';
    res.render(newLocal, {row});
});
router.post('/QLDocGia/StartAdd', async function (req, res) {
    const NS =  moment(req.body.NgaySinh , 'YYYY-MM-DD').format('YYYY/MM/DD');
    const TH =  moment(req.body.ThoiHan, 'YYYY-MM-DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS');
    const body = {
        TenTaiKhoan: req.body.TenTaiKhoan,
        MatKhau: req.body.MatKhau,
        HoTen: req.body.HoTen,
        email: req.body.email,
        NgaySinh: NS,
        ThoiHan: TH,
        VaiTroID: 4
    }
    await adminmodel.InsertTaiKhoan(body);
    res.redirect('/admin/QLDocGia/add');
});
router.post('/QLDocGia/Startedit', async function (req, res) {
    const NS =  moment(req.body.NgaySinh , 'YYYY-MM-DD').format('YYYY/MM/DD');
    const TH =  moment(req.body.ThoiHan, 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS');
    const body = {
        id: req.body.id,
        TenTaiKhoan: req.body.TenTaiKhoan,
        MatKhau: req.body.MatKhau,
        HoTen: req.body.HoTen,
        email: req.body.email,
        NgaySinh: NS,
        ThoiHan: TH,
        VaiTroID: 4
    }
    await adminmodel.UpdateTaiKhoan(body);
    res.redirect('/admin/QLTaiKhoan');
});
router.get('/QLDocGia/del/:id', async function (req, res) {
    const id = +req.params.id || -1;
    await adminmodel.DeleteTaiKhoan(id);
    res.redirect('/admin/QLTaiKhoan');
});
router.get('/QlTaiKhoan', async function (req, res) {
    //BTV
    const id = 2;
    const list = await adminmodel.LoadBienTapVien(id);
    for(var i = 0; i < list.length ; i++){
        list[i].NgaySinh = moment(list[i].NgaySinh, 'YYYY/MM/DD').format('YYYY/MM/DD');
    }
    //PV
    const id1 = 3;
    const list1 = await adminmodel.LoadTaiKhoan(id1);
    for(var i = 0; i < list1.length ; i++){
        list1[i].NgaySinh = moment(list1[i].NgaySinh, 'YYYY/MM/DD').format('YYYY/MM/DD');
    }
    //DG
    const id2 = 4;
    const list2 = await adminmodel.LoadTaiKhoan(id2);
    for(var i = 0; i < list2.length ; i++){
        list2[i].NgaySinh = moment(list2[i].NgaySinh, 'YYYY/MM/DD').format('YYYY/MM/DD');
        list2[i].ThoiHan = moment(list2[i].ThoiHan, 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS');
    }
    const newLocal = 'vwadmin/QLTaiKhoan';
    res.render(newLocal, {lists: list, lists1: list1, lists2: list2});
});
module.exports = router;