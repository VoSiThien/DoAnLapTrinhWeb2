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

//----------------------------------------------User management------------------------------------
//--List
router.get('/Users', async function (req, res) {
    const list = await accountModel.load();
    const newLocal = 'vwAdmin/Users/list';
    res.render(newLocal, {List: list, layout:'adminPanel'});
});
module.exports = router;