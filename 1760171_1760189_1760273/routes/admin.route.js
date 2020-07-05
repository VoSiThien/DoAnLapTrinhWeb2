const express = require('express');
const moment = require('moment');
const postModel = require('../models/post.model');

const router = express.Router();

const postsModel = require('../models/post.model');
const tagModel = require('../models/tag.model');
const categoriesModel = require('../models/categories.model');
const accountModel = require('../models/account.model');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/reporterImage')
    },

    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});


var upload = multer({
    storage: storage,
    limits: {
        files: 1,
        fileSize: 2048 * 2048
    }
});
//------------HOME------------------------------
router.get('/', async function (req, res) {
    const newLocal = 'vwadmin/AdminPannel';
    res.render(newLocal);
});

//----------------------------------------------Posts management------------------------------------
//--List
router.get('/Posts', async function (req, res) {
    const list = await postsModel.load();
    const newLocal = 'vwAdmin/Posts/list';
    res.render(newLocal, {List: list});
});
router.get('/Posts/:id&:key', async function (req, res) {
    const id = +req.params.id || -1;
    const key = +req.params.key || -1;
    if(key == 1){//xaut ban
        await postsModel.updatePulishedDate(id);
        const newLocal = '/admin/Posts';
        res.redirect(newLocal);
    }
    if(key == 2){//detail
        const list = await postsModel.loadByID(id);
        const row = list[0];
        const newLocal = 'vwAdmin/Posts/Detail';
        res.render(newLocal, {row});
    }
    if(key == 3){//them tag
        const row = id;
        const newLocal = 'vwAdmin/Posts/addTag';
        res.render(newLocal, {row});
    }
    if(key == 4){//xoa bai
        const BaiVietID = id;
        await tagModel.deleteAllPostID(BaiVietID);
        await postsModel.delete(id);
        res.redirect('/admin/Posts');
    }
});
//--them tag
router.post('/Posts/addTag', async function (req, res) {
    const entity = {
        TenTag: req.body.TenTag,
        BaiVietID: req.body.BaiVietID
    }
    await tagModel.insert(entity);
    req.headers.referer;//ko bik dung
});
//-- duyet bai/edit bai
router.get('/Posts/accept/:id', async function (req, res) {
    var postID = req.params.id;
    const row = await postModel.loadByID(postID);
    const tagsRow = await tagModel.loadByPostID(postID);
    var stringTag = "";
    var tagIndex = [];
    for (let i = 0; i < tagsRow.length; i++) {
        //store the id index of tag
        tagIndex.push(tagsRow[i]["id"]);
        stringTag += tagsRow[i]["TenTag"];
        stringTag += ",";
    }
    req.session.tagIndex = tagIndex;
    stringTag = stringTag.substring(0, stringTag.length - 1);
    res.render('vwAdmin/Posts/edit', { ListPost: row, Tag: stringTag, selectedCategory: row[0]["ChuyenMucID"] });
});

const directory = 'public/reporterImage/';
router.post('/Posts/accept/:id', upload.single('urlImage'), async function (req, res) {
    var postID = req.params.id;
    const row = await postModel.loadByID(postID);
    imageName = row[0]["HinhAnh"];
    // if recieve new image, delete old image 
    if (req.file) {
        const imagePath = directory + row[0]["HinhAnh"];
        fs.unlinkSync(imagePath);
        imageName = req.file.filename;
    }
    //edit post
    var postEntity = {
        id: postID,
        TieuDe: req.body.TieuDe,
        NoiDungTat: req.body.NoiDungTat,
        NoiDung: req.body.NoiDung,
        NgayXuatBan: req.body.NgayXuatBan,
        HinhAnh: imageName,
        LuotXem: 0,
        TrangThaiID: 1,
        ChuyenMucID: +req.body.ChuyenMucID,
        TaiKhoanID: row[0]["TaiKhoanID"],
        isPremium: 1
    }
    await postModel.update(postEntity);
    //edit tag
    var words = req.body.tag.split
    const newTags = req.body.tag.split(',');
    console.log(newTags);
    const idIndex = req.session.tagIndex;

    const idIndexLength = req.session.tagIndex.length;
    const newTagsLength = newTags.length;

    for (let i = 0; i < Math.min(idIndexLength, newTagsLength); i++) {
        var tagEntity = {
            id: idIndex[i],
            TenTag: newTags[i],
            BaiVietID: postID
        }
        await tagModel.update(tagEntity);
    }
    //insert the new index for new tag
    if (idIndexLength < newTagsLength) {
        for (let i = idIndexLength; i < newTagsLength; i++) {
            var tagEntity = {
                TenTag: newTags[i],
                BaiVietID: postID
            }
            await tagModel.insert(tagEntity);
        }
    }
    //delete the old tag if the number of edited tag < quantity of old tags
    if (idIndexLength > newTagsLength) {
        for (let i = newTagsLength; i < idIndexLength; i++) {
            await tagModel.delete(idIndex[i]);
        }
    }
    //destroy session
    req.body.tag = null;
    req.session.tagIndex = null;
    res.redirect('/admin/Posts');
});
//--add
router.get('/Posts/add', async function(req,res){
    res.render('vwAdmin/Posts/add');
})
router.post('/Posts/add', upload.single('urlImage'), async function (req, res) {
    //insert post
    var newestPostID = await postModel.getNewestID();
    var postEntity = {
        TieuDe: req.body.TieuDe,
        NoiDungTat: req.body.NoiDungTat,
        NoiDung: req.body.NoiDung,
        NgayXuatBan: '0/0/0',
        HinhAnh: req.file.filename,
        LuotXem: 0,
        TrangThaiID: 2,
        ChuyenMucID: +req.body.ChuyenMucID,
        TaiKhoanID: 1,//sửa lại sau
        isPremium: 0
    }
    await postModel.insert(postEntity);
    //insert tag
    const tags = req.body.tag.split(',');
    for (let i = 0; i < tags.length; i++) {
        var tagEntity = {
            TenTag: tags[i],
            BaiVietID: +newestPostID[0]["newest"]
        }
        await tagModel.insert(tagEntity);
    }
    res.redirect('/admin/Posts/add');
});
//----------------------------------------------Categories management------------------------------------
//--List
router.get('/Categories', async function (req, res) {
    const list = await categoriesModel.loadAll();
    const newLocal = 'vwAdmin/Categories/list';
    res.render(newLocal, {List: list});
});
//----------------------------------------------Tag management------------------------------------
//--List
router.get('/Tag', async function (req, res) {
    const list = await tagModel.load();
    const newLocal = 'vwAdmin/Tags/list';
    res.render(newLocal, {List: list});
});
//--add
router.get('/Tag/add', async function (req, res) {
    const list = await postsModel.load();
    res.render('vwAdmin/Tags/add', {List : list});
});
router.post('/Tag/add', async function (req, res) {
    const entity = {
        TenTag: req.body.TenTag,
        BaiVietID: req.body.BaiVietID
    }
    await tagModel.insert(entity);
    res.redirect('/admin/Tag/add');
});
//--edit
router.get('/Tag/edit/:id', async function (req, res) {
    const id = +req.params.id || -1;
    const list = await postsModel.load();
    const list1 = await tagModel.loadByID(id);
    res.render('vwAdmin/Tags/edit', {List : list, row: list1[0]});
});
router.post('/Tag/edit/:id', async function (req, res) {
    const entity = {
        id: req.body.id,
        TenTag: req.body.TenTag,
        BaiVietID: req.body.BaiVietID
    }
    await tagModel.update(entity);
    res.redirect('/admin/Tag');
});
//--delete
router.get('/Tag/del/:id', async function (req, res) {
    const id = +req.params.id || -1;
   await tagModel.delete(id);
   res.redirect('/admin/Tag');
});
//----------------------------------------------User management------------------------------------
//--List
router.get('/User', async function (req, res) {
    const list = await accountModel.load();
    const newLocal = 'vwAdmin/Users/list';
    res.render(newLocal, {List: list});
});
module.exports = router;