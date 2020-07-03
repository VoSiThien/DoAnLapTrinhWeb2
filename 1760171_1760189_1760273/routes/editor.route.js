const express = require('express');
const router = express.Router();
const postModel = require('../models/post.model');
const tagModel = require('../models/tag.model')
const fs = require('fs')
const multer = require('multer');
var path = require('path');
var dateFormat = require('dateformat');

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
router.get('/post', function (req, res) {
    res.render('vwReporter/post');
});

//------------------------------show post------------------------------------------------------
router.get('/post', async function (req, res) {
    var category = res.locals.lcUser[0]["ChuyenMucQuanLy"];
    const list = await postModel.loadDraftPost(category);
    res.render('vwEditor/list', { List: list });
});

//-----------------------------accept and edit post--------------------------------------------
router.get('/accept/:id', async function (req, res) {
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
    res.render('vwEditor/accept', { ListPost: row, Tag: stringTag, selectedCategory: row[0]["ChuyenMucID"] });
});

const directory = 'public/reporterImage/';
router.post('/accept/:id', upload.single('urlImage'), async function (req, res) {
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
        NgayXuatBan: dateFormat(Date(req.body.NgayXuatBan), "yyyy/mm/dd"),
        HinhAnh: imageName,
        LuotXem: 0,
        TrangThaiID: 1,
        ChuyenMucID: +req.body.ChuyenMucID,
        TaiKhoanID: row[0]["TaiKhoanID"],
        isPremium: 1
    }
    console.log(dateFormat(Date(req.body.NgayXuatBan), "yyyy/mm/dd"));
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
    //var category = res.locals.lcUser[0]["ChuyenMucQuanLy"];
    //const list = await postModel.loadDraftPost(category);
    //res.render('vwEditor/list', { List: list });
    res.render('vwEditor/accept');
});
//------------------------------denied action---------------------------------------------------
module.exports = router;
