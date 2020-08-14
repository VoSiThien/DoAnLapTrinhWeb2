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
        cb(null, 'public/images/articles')
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
const accountModels = require('../models/accounts.model');
const mdwFunction = require('../middlewares/middle-functions.mdw')

//------------HOME------------------------------
router.get('/', async function (req, res) {
    const newLocal = 'vwAdmin/dashboard';
    res.render(newLocal, { layout: 'adminPanel' });
});

//----------------------------------------------Posts management------------------------------------
//--List
router.get('/Posts', async function (req, res) {
    var list = [];
    const listAuthor = await accountModel.loadReporter();
    list = listAuthor;
    for (let i = 0; i < list.length; i++) {
        var listPost = await postsModel.loadByAuthor(list[i]["id"]);
        for (let j = 0; j < listPost.length; j++) {
            list[i][j] = listPost[j];
            var listTag = await tagModel.loadByPostID(list[i][j]["id"]);

            for (let k = 0; k < listTag.length; k++) {
                list[i][j][k] = listTag[k];
            }
        }
    }
    const newLocal = 'vwAdmin/Posts/list';
    res.render(newLocal, { List: list, layout: 'adminPanel' });
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
    const catRow = await categoriesModel.loadAll();
    let list = [];
    catRow.forEach((cat) => {
        if (cat["ChuyenMucCon"] === null) {
            list.push([cat]);
        } else {
            for (let i = 0; i < catRow.length; ++i) {
                if (list[i][0]["id"] === cat["ChuyenMucCon"]) {
                    list[i].push(cat);
                    break;
                }
            }
        }
    });
    const newLocal = 'vwAdmin/Categories/list';

    res.render(newLocal, { List: list, layout: 'adminPanel' });
});
//--Validation
router.get('/Categories/add/validation', async function (req, res) {
    if (req.query.parentID)
        var parentID = req.query.parentID;
    const name = req.query.categoryname;
    var result = 0;
    //is child
    if (req.query.parentID) {
        let catRow = await categoriesModel.loadChildByNameAndParentID(name, parentID);
        if (catRow.length != 0)
            result = 1;
    }
    else {//is parent
        let catRow = await categoriesModel.loadParentByName(name);
        if (catRow.length != 0)
            result = 2;
    }


    res.json({ result });
});

router.get('/Categories/edit/validation', async function (req, res) {
    const id = req.query.id;
    const name = req.query.categoryname;
    var result = 0;
    //load cat by ID if it is parent
    const Row = await categoriesModel.loadParentByID(id);
    //is child
    if (Row.length == 0) {
        let parentRow = await categoriesModel.loadParent(id);
        let catRow = await categoriesModel.loadChildByNameAndParentID(name, parentRow[0]["id"]);
        if (catRow.length != 0)
            result = 1;
    }
    else {//is parent
        let catRow = await categoriesModel.loadParentByName(name);
        if (catRow.length != 0)
            result = 2;
    }
    res.json({ result });
});
//--Insert
router.post('/Categories/add', async function (req, res) {
    var parentID = null;
    if (req.body.ParentID)
        parentID = req.body.ParentID;
    const entity = {
        TenChuyenMuc: req.body.TenChuyenMuc,
        ChuyenMucCon: parentID
    }
    await categoriesModel.insert(entity)

    let NextID = await categoriesModel.getNextAutoIncrement();
    NextID = NextID[0].AUTO_INCREMENT;
    let CountParent = await categoriesModel.countParent();
    CountParent = CountParent[0]["COUNT(*)"];
    res.json({ nextID: NextID, countParent: CountParent });
});

//--Edit
router.post('/Categories/edit', async function (req, res) {
    const cat = await categoriesModel.loadByID(req.body.id);
    const entity = {
        id: req.body.id,
        TenChuyenMuc: req.body.TenChuyenMuc,
        ChuyenMucCon: cat[0]["ChuyenMucCon"]
    }
    await categoriesModel.update(entity);
    res.json({});
});
//--Delete
router.get('/Categories/del/:id', async function (req, res) {
    const id = +req.params.id || -1;
    var result = 0;
    const parentRow = await categoriesModel.loadParentByID(id);
    //is child
    if (parentRow.length == 0) {
        const postRow = await categoriesModel.loadPostListByCatID(id);
        if (postRow.length != 0) {
            result = 1;
        }
        else {
            await categoriesModel.delete(id);
        }
    }
    else {//is parent
        const childRow = await categoriesModel.loadChild(id);
        if (childRow.length != 0) {
            result = 2;
        }
        else {
            await categoriesModel.delete(id);
        }
    }

    res.json({ result });
});
//----------------------------------------------Tag management------------------------------------
//--List
router.get('/Tags', async function (req, res) {
    var list = [];
    var listPost = await postsModel.loadByOffset(0);
    for (let i = 0; i < listPost.length; i++) {
        list[i] = listPost[i];
        var listTag = await tagModel.loadByPostID(list[i]["id"]);

        for (let j = 0; j < listTag.length; j++) {
            list[i][j] = listTag[j];
        }
    }
    const Quantity = await postsModel.quantity();

    const newLocal = 'vwAdmin/Tags/list'
    res.render(newLocal, {
        List: list, quantity: Quantity[0]["quantity"],
        pagi: mdwFunction.rangeOfPagination(Math.ceil(Quantity[0]["quantity"] / 10), 1), layout: 'adminPanel'
    });
});
router.get('/Tags/list', async function (req, res) {
    var p = 1;
    var list = [];
    if (req.query.p)
        p = req.query.p;

    var listPost = await postsModel.loadByOffset((p - 1) * 10);
    for (let i = 0; i < listPost.length; i++) {
        list[i] = listPost[i];
        var listTag = await tagModel.loadByPostID(list[i]["id"]);

        for (let j = 0; j < listTag.length; j++) {
            list[i][j] = listTag[j];
        }
    }
    const Quantity = await postsModel.quantity();
    res.json({
        List: list, quantity: Quantity[0]["quantity"],
        pagi: mdwFunction.rangeOfPagination(Math.ceil(Quantity[0]["quantity"] / 10), p)
    });
});
//--validation
router.get('/Tags/validation', async function (req, res) {
    const taglist = await tagModel.loadByPostIDAndName(req.query.tagname, req.query.postID);
    let result = taglist.length == 0 ? true : false;
    res.json({ res: result });
});
//--add
router.get('/Tags/add', async function (req, res) {
    const nextID = await tagModel.getNextAutoIncrement();
    res.json({ nextID: nextID[0]["AUTO_INCREMENT"] });
});
router.post('/Tags/add', async function (req, res) {
    const entity = {
        TenTag: req.body.TenTag,
        BaiVietID: req.body.BaiVietID
    }
    await tagModel.insert(entity);
    res.json({});
});

//--edit
router.post('/Tags/edit', async function (req, res) {
    const tag = await tagModel.loadByID(req.body.id);

    const entity = {
        id: req.body.id,
        TenTag: req.body.TenTag,
        BaiVietID: tag[0]["BaiVietID"]
    }
    await tagModel.update(entity);
    res.json({});
});

//--Delete
router.get('/Tags/del/:id', async function (req, res) {
    const id = +req.params.id || -1;
    await tagModel.delete(id);
    res.json(true);
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
router.get('/Users/getManagedCategoryList', async (req, res) => {
    res.json({ CategoryList: res.locals.lcCats });
});


router.get('/Users/getManagedCategory/:id', async (req, res) => {
    var List = await accountModel.loadbyID(req.params.id);
    var chuyenmucquanly = await categoriesModel.loadManagementCategory(List[0]["ChuyenMucQuanLy"]);

    res.json({ ManagedCat: chuyenmucquanly[0].TenChuyenMuc, id: chuyenmucquanly[0].id });
});

router.get('/Users', async function (req, res) {
    const list = await accountModels.loadByOffset(0);
    for (let i = 0; i < list.length; i++) {
        list[i]["ThoiHan"] = mdwFunction.formatDateTime(list[i]["ThoiHan"]);
        var chuyenmucquanly = await categoriesModel.loadManagementCategory(list[i]["ChuyenMucQuanLy"]);
        if (chuyenmucquanly.length != 0) {
            list[i]["ChuyenMucQuanLy"] = chuyenmucquanly[0].TenChuyenMuc;
        }
        else {
            list[i]["ChuyenMucQuanLy"] = null;
        }
    }
    const newLocal = 'vwAdmin/Users/list';

    const Quantity = await accountModels.quantity();
    res.render(newLocal, {
        List: list, quantity: Quantity[0]["quantity"],
        pagi: mdwFunction.rangeOfPagination(Math.ceil(Quantity[0]["quantity"] / 5), 1), layout: 'adminPanel'
    });
});

router.get('/Users/list', async function (req, res) {
    var p = 1;
    var list = [];
    if (req.query.p)
        p = req.query.p;

    list = await accountModels.loadByOffset((p - 1) * 5);

    for (let i = 0; i < list.length; i++) {
        list[i]["ThoiHan"] = mdwFunction.formatDateTime(list[i]["ThoiHan"]);
    }

    for (let i = 0; i < list.length; i++) {
        var chuyenmucquanly = await categoriesModel.loadManagementCategory(list[i]["ChuyenMucQuanLy"]);
        if (chuyenmucquanly.length != 0) {
            list[i]["ChuyenMucQuanLy"] = chuyenmucquanly[0].TenChuyenMuc;
        }
        else {
            list[i]["ChuyenMucQuanLy"] = null;
        }
    }

    const Quantity = await accountModels.quantity();
    const newLocal = 'vwAdmin/Users/list';
    res.json({
        List: list, quantity: Quantity[0]["quantity"],
        pagi: mdwFunction.rangeOfPagination(Math.ceil(Quantity[0]["quantity"] / 5), p)
    });
});

router.post('/Users/updateCat', async (req, res) => {
    await accountModel.changeManagedCategory(req.body.catValue, req.body.id);
    var List = await accountModel.loadbyID(req.body.id);
    var chuyenmucquanly = await categoriesModel.loadManagementCategory(List[0]["ChuyenMucQuanLy"]);
    res.json({ ManagedCat: chuyenmucquanly[0].TenChuyenMuc, id: chuyenmucquanly[0].id });
});

router.get('/Users/checkExistAthName', async (req, res) => {
    var isNotExist = true;
    var row = await accountModel.loadByAthName(req.query.AthName);
    if(row.length != 0)
        isNotExist = false;
    res.json({NotExist:isNotExist});
});

router.post('/Users/update', async (req, res) => {
    if (req.body.roleID != null)
        await accountModel.changeRole(req.body.roleID, req.body.id);
    if (req.body.ExpireDate != null){
        await accountModel.changeDate(req.body.ExpireDate, req.body.id);
    }
    if (req.body.ButDanh != null){
        await accountModel.changeAthName(req.body.ButDanh, req.body.id);
    }
    list = await accountModel.loadbyID(req.body.id);
    list[0]["ThoiHan"] = mdwFunction.formatDateTime(list[0]["ThoiHan"]);
    var chuyenmucquanly = await categoriesModel.loadManagementCategory(list[0]["ChuyenMucQuanLy"]);
    if (chuyenmucquanly.length != 0) {
        list[0]["ChuyenMucQuanLy"] = chuyenmucquanly[0].TenChuyenMuc;
    }
    else {
        list[0]["ChuyenMucQuanLy"] = null;
    }
    res.json({List:list[0]});
});


module.exports = router;














