const express = require('express');
const moment = require('moment');

const router = express.Router();

const postsModel = require('../models/post.model');
const tagModel = require('../models/tag.model');
const categoriesModel = require('../models/categories.model');
const accountModel = require('../models/account.model');
//------------HOME------------------------------
router.get('/', async function (req, res) {
    const newLocal = 'vwAdmin/dashboard';
    res.render(newLocal, {layout: 'adminPanel'});
});

//----------------------------------------------Posts management------------------------------------
//--List
router.get('/Posts', async function (req, res) {
    const list = await postsModel.load();
    const newLocal = 'vwAdmin/Posts/list';
    res.render(newLocal, {List: list, layout:'adminPanel'});
});
//----------------------------------------------Categories management------------------------------------
//--List
router.get('/Categories', async function (req, res) {
    const list = await categoriesModel.loadAll();
    const newLocal = 'vwAdmin/Categories/list';
    res.render(newLocal, {List: list, layout:'adminPanel'});
});
//----------------------------------------------Tag management------------------------------------
//--List
router.get('/Tags', async function (req, res) {
    var list = [];
    const listAuthor = await accountModel.loadReporter();
    list = listAuthor;
    for(let i = 0; i < list.length; i++){
        var listPost = await postsModel.loadByAuthor(list[i]["id"]);
        for(let j = 0; j < listPost.length;j++){
            list[i][j] = listPost[j];
            var listTag = await tagModel.loadByPostID(list[i][j]["id"]);
     
            for(let k = 0; k < listTag.length; k++){
                list[i][j][k] = listTag[k];
            }
        }
    }
    const newLocal = 'vwAdmin/Tags/list';
    res.render(newLocal, {List: list, layout:'adminPanel'});
});
//--validation
router.get('/Tags/validation', async function (req, res) {
    const taglist = await tagModel.loadByPostIDAndName(req.query.tagname,req.query.postID);
    let result = taglist.length == 0 ? true : false;
    res.json({res: result});
});
//--add
router.get('/Tags/add', async function (req, res) {
    const nextID = await tagModel.getNextAutoIncrement();
    res.json({nextID : nextID[0]["AUTO_INCREMENT"]});
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
    res.render(newLocal, {List: list, layout:'adminPanel'});
});
module.exports = router;














