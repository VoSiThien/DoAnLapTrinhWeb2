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