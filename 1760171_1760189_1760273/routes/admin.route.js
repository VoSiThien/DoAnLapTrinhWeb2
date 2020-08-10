const express = require('express');
const moment = require('moment');

const router = express.Router();

const postsModel = require('../models/post.model');
const tagModel = require('../models/tag.model');
const categoriesModel = require('../models/categories.model');
const accountModel = require('../models/account.model');
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
    for (let  i = 0; i < listPost.length; i++) {
        list[i] = listPost[i];
        var listTag = await tagModel.loadByPostID(list[i]["id"]);

        for (let j = 0; j < listTag.length; j++) {
            list[i][j] = listTag[j];
        }
    }
    const Quantity = await postsModel.quantity();

    const newLocal = 'vwAdmin/Tags/list'
    res.render(newLocal, {
        List: list, quantity: Quantity,
        pagi: mdwFunction.rangeOfPagination(Math.ceil(Quantity / 10), 1), layout: 'adminPanel'
    });
});
router.get('/Tags/list', async function (req, res) {
    var p = 1;
    var list = [];
    if (req.query.p)
        p = req.query.p;

    var listPost = await postsModel.loadByOffset((p - 1) * 10);
    for (let  i = 0; i < listPost.length; i++) {
        list[i] = listPost[i];
        var listTag = await tagModel.loadByPostID(list[i]["id"]);

        for (let j = 0; j < listTag.length; j++) {
            list[i][j] = listTag[j];
        }
    }
    const Quantity = await postsModel.quantity();
    res.json({
        List: list, quantity: Quantity[0],
        pagi: mdwFunction.rangeOfPagination(Math.ceil(Quantity / 10), p)
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
router.get('/Users', async function (req, res) {
    const list = await accountModel.load();
    const newLocal = 'vwAdmin/Users/list';
    res.render(newLocal, { List: list, layout: 'adminPanel' });
});
module.exports = router;














