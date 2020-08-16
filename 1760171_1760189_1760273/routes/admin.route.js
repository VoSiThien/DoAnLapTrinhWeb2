const express = require('express');
const moment = require('moment');

const router = express.Router();
const statusModel = require('../models/postStatus.model')
const postsModel = require('../models/post.model');
const tagModel = require('../models/tag.model');
const categoriesModel = require('../models/categories.model');
const accountModel = require('../models/accounts.model');
const mdwFunction = require('../middlewares/middle-functions.mdw')

const fs = require('fs')
const multer = require('multer');
var path = require('path');
var dateFormat = require('dateformat');

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
            var stringTag = "";
            var tagIndex = [];
            for (let i = 0; i < listTag.length; i++) {
                //store the id index of tag
                tagIndex.push(listTag[i]["id"]);
                stringTag += listTag[i]["TenTag"];
                stringTag += ",";
            }
            stringTag = stringTag.substring(0, stringTag.length - 1);
            list[i][j]["Tag"] = stringTag;
            list[i][j]["TagIndex"] = tagIndex;
        }
    }
    const newLocal = 'vwAdmin/Posts/list';
    res.render(newLocal, { List: list, layout: 'adminPanel' });
});
router.get('/Posts/:id', async function (req, res) {
    var postID = req.params.id;
    const row = await postsModel.loadByID(postID);
    const tagsRow = await tagModel.loadByPostID(postID);
    const status = await statusModel.load(postID);
    row[0]["TenTrangThai"] = status[0]["TenTrangThai"];
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
    const newLocal = 'vwAdmin/Posts/edit';
    res.render(newLocal, { ListPost: row, Tag: stringTag, selectedCategory: row[0]["ChuyenMucID"], layout: 'adminPanel'});
});

router.post('/Posts/:id', upload.single('urlImage'), async function (req, res) {
    var postID = req.params.id;
    const row = await postsModel.loadByID(postID);
    var imagePath = row[0]["HinhAnh"];
    // if recieve new image, delete old image 
    if (req.file) {
        imagePath = row[0]["HinhAnh"].substring(1,row[0]["HinhAnh"].length);
        fs.unlinkSync(imagePath);
        imagePath = '/public/images/articles/' + req.file.filename;
    }
    //edit post
    await postsModel.changeTitle(req.body.TieuDe, postID);
    await postsModel.changeShortContent(req.body.NoiDungTat, postID);
    await postsModel.changeContent(req.body.NoiDung, postID);
    if(req.body.NgayXuatBan){
        await postsModel.changeDatePublish(req.body.NgayXuatBan, postID);
        await postsModel.changeStatusID(1, postID);
    }
    await postsModel.changePhoto(imagePath, postID);
    await postsModel.changePremium(+req.body.Premium, postID);
    await postsModel.changeCategoryID(+req.body.ChuyenMucID, postID);
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
    const list = await accountModel.loadByOffset(0);
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

    const Quantity = await accountModel.quantity();

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

    list = await accountModel.loadByOffset((p - 1) * 5);

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

    const Quantity = await accountModel.quantity();
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
    if (row.length != 0)
        isNotExist = false;
    res.json({ NotExist: isNotExist });
});

router.post('/Users/update', async (req, res) => {
    if (req.body.roleID != null)
        await accountModel.changeRole(req.body.roleID, req.body.id);
    if (req.body.ExpireDate != null) {
        await accountModel.changeDate(req.body.ExpireDate, req.body.id);
    }
    if (req.body.ButDanh != null) {
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
    res.json({ List: list[0] });
});


module.exports = router;
