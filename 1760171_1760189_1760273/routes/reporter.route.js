const express = require('express');
const router = express.Router();
const postModel = require('../models/post.model');
const tagModel = require('../models/tag.model');
const multer = require('multer');
var path = require('path');


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
router.get('/post', function (req,res) {
    res.render('vwReporter/post');
});

router.post('/post', upload.single('urlImage'), async function (req,res){
    //insert post
    var newestPostID = await postModel.getNewestID();
    var postEntity = {
        TieuDe: req.body.TieuDe,
        NoiDungTat: req.body.NoiDungTat,
        NoiDung: req.body.NoiDung,
        NgayXuatBan: '0/0/0',
        HinhAnh: req.file.filename,
        LuotXem:0,
        TrangThaiID:2,
        ChuyenMucID: +req.body.ChuyenMucID,
        TaiKhoanID: 3,//sửa lại sau
        isPremium: 0
    } 
    await postModel.insert(postEntity);
    //insert tag
    const tags = req.body.tag.split(',');
    for(let i = 0; i < tags.length; i++){
        var tagEntity = {
            TenTag: tags[i],
            BaiVietID: +newestPostID[0]["newest"]
        }
        await tagModel.insert(tagEntity);
    }
    res.render('vwReporter/listPost');
});

module.exports = router;