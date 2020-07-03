const express = require('express');
const router = express.Router();
const postModel = require('../models/post.model');

router.get('/post', async function (req, res) {
    var category = res.locals.lcUser[0]["ChuyenMucQuanLy"];
    console.log(category);
    const list = await postModel.loadDraftPost(category);
    res.render('vwEditor/list', {List:list});
});


module.exports = router;
