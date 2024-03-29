const express = require('express');
const router = express.Router();
const accountModel = require('../models/account.model');
const moment = require('moment');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const categoriesModel = require('../models/categories.model');


//------------------------------------------------LOGIN------------------------------------------------------
restrict = require('../middlewares/isNotAuthenticated.mdw')

router.get('/login', restrict, async function (req, res) {
    res.render('vwAccount/login', {
        layout: false
    });
});
router.post('/login', async function (req, res) {
    const rows = await accountModel.loadUser(req.body.username);
    if (rows.length == 0) {
        return res.render('vwAccount/login', {
            layout: false,
            error: 'Invalid username or password.'
        })

    }
    else {
        const check = bcrypt.compareSync(req.body.password, rows[0].MatKhau);
        if(check == true){
            req.session.isAuthenticated = true;
            req.session.user = rows;
            res.redirect('/account/profile');
        }
        else{
            return res.render('vwAccount/login', {
                layout: false,
                error: 'Invalid username or password.'
            })
        }
        
    }
})

router.get('/logout', async function (req, res) {
    req.session.isAuthenticated = null;
    req.session.user = null;
      res.redirect('/');
});

//----------------------------------------------Register-----------------------------------------------------
router.get('/register', async function (req, res) {
    res.render('vwAccount/register');
});

router.post('/register', async function (req, res) {
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const NS = moment(req.body.DOB, 'YYYY/MM/DD').format('YYYY/MM/DD');
    const entityAccount = {
        TenTaiKhoan: req.body.username,
        MatKhau: hash,
        HoTen: req.body.fullname,
        ButDanh: null,
        email: req.body.email,
        NgaySinh: NS,
        VaiTroID: 4,
        ChuyenMucQuanLy: null
    }
    await accountModel.add(entityAccount);
    res.redirect('/account/login');
});

//-------------------------------------------Profile------------------------------------------------------------
restrict = require('../middlewares/isAuthenticated.mdw')
router.get('/profile', restrict, async function (req, res) {
    const rows = await categoriesModel.loadChuyenMucByID(res.locals.lcUser[0].ChuyenMucQuanLy);
    res.render('vwAccount/profile', {row: rows[0]});
});


router.get('/profile/edit', restrict, async function (req, res) {
    var check = false;
    if(res.locals.lcUser[0].id == 3){
        check = true
    }
    res.render('vwAccount/editProfile', {check});
});
router.post('/profile/edit', restrict, async function (req, res) {
    const hash = bcrypt.hashSync(req.body.MatKhau, saltRounds);
    const NS = moment(req.body.NgaySinh, 'YYYY/MM/DD').format('YYYY/MM/DD');
    var BD = null;
    if(req.body.id == 3){
        BD = req.body.ButDanh;
    }
    const entity = {
        id: req.body.id,
        TenTaiKhoan: req.body.TenTaiKhoan,
        MatKhau: hash,
        HoTen: req.body.HoTen,
        ButDanh: BD,
        email: req.body.email,
        NgaySinh: NS,
        ThoiHan: res.locals.lcUser[0].ThoiHan,
        VaiTroID: res.locals.lcUser[0].VaiTroID,
        ChuyenMucQuanLy: res.locals.lcUser[0].ChuyenMucQuanLy
    }
    await accountModel.update(entity);
    res.redirect('/account/profile');
});
module.exports = router;