const express = require('express');
const moment = require('moment');

const router = express.Router();

const postsModel = require('../models/post.model');
const tagModel = require('../models/tag.model');
const categoriesModel = require('../models/categories.model');
const accountModel = require('../models/account.model');
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
    if(key == 1){
        await postsModel.updatePulishedDate(id);
        const newLocal = '/admin/Posts';
        res.redirect(newLocal);
    }
    if(key == 2){
        const list = await postsModel.loadByID(id);
        const row = list[0];
        const newLocal = 'vwAdmin/Posts/Detail';
        res.render(newLocal, {row});
    }
    if(key == 3){
        const list = await postsModel.loadByID(id);
        const row = list[0];
        const newLocal = 'vwAdmin/Posts/edit';
        res.render(newLocal, {row});
    }
    if(key == 4){
        const BaiVietID = id;
        await tagModel.deleteAllPostID(BaiVietID);
        await postsModel.delete(id);
        res.redirect('/admin/Posts');
    }
});
router.post('/Posts/edit', async function (req, res) {
    const NXB = moment(req.body.NgayXuatBan, 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS');
    const entityPost = {
        id: req.body.id,
        NgayXuatBan: NXB
    }
    await postsModel.update(entityPost);
    res.redirect('/admin/Posts');
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

//----------------------------------------------User management------------------------------------
//--List
router.get('/User', async function (req, res) {
    const list = await accountModel.load();
    const newLocal = 'vwAdmin/Users/list';
    res.render(newLocal, {List: list});
});
module.exports = router;