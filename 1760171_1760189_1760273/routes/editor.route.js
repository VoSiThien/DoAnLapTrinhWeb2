const express = require('express');
const router = express.Router();
const postModel = require('../models/post.model');
const tagModel = require('../models/tag.model')
const postFeedBackModel = require('../models/postFeedback.model');
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

//------------------------------show post------------------------------------------------------
const ejs = require("ejs");
const pdf = require("html-pdf");

router.get('/post', async function (req, res) {
    var category = req.session.authUser.ChuyenMucQuanLy;
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

const directory = '/public/images/articles/';
router.post('/accept/:id', upload.single('urlImage'), async function (req, res) {
    var postID = req.params.id;
    const row = await postModel.loadByID(postID);
    var imagePath = row[0]["HinhAnh"];
    // if recieve new image, delete old image 
    if (req.file) {
        imagePath = row[0]["HinhAnh"].substring(1,row[0]["HinhAnh"].length);
        fs.unlinkSync(imagePath);
        imagePath = '/public/images/articles/' + req.file.filename;
    }

    const articles = {TieuDe: req.body.TieuDe, NoiDungTat: req.body.NoiDungTat, NoiDung: req.body.NoiDung};
    //xuat PDF
    ejs.renderFile(path.join(__dirname, '../views/vwEditor/', "ExportPDFS.hbs"), {articles: articles}, (err, data) => {
        if (err) {
              res.send(err);
        } else {
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toFile(`public/PDFS/articles/${postID}.pdf`, function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    //res.send("File created successfully");
                }
            });
        }
    });
    //======
    //edit post
    var postEntity = {
        id: postID,
        TieuDe: req.body.TieuDe,
        NoiDungTat: req.body.NoiDungTat,
        NoiDung: req.body.NoiDung,
        NgayXuatBan: req.body.NgayXuatBan,
        HinhAnh: imagePath,
        PDF:`/public/PDFS/articles/${postID}.pdf`,
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
    var category = req.session.authUser.ChuyenMucQuanLy;
    
    const list = await postModel.loadDraftPost(category);
    //destroy session
    req.body.tag = null;
    req.session.tagIndex = null;
    res.render('vwEditor/list', { List: list });
});
//------------------------------denied action---------------------------------------------------
router.post("/deny",async function(req,res){
    var check = await postFeedBackModel.update(req.body);
    if(check.changedRows == 0){
        await postFeedBackModel.insert(req.body);
    }
    await postModel.updateStatus(req.body.BaiVietID, 4);
    res.redirect('/editor/post');
})
module.exports = router;
